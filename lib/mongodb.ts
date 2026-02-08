import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnected: boolean;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

let cached = global.mongoose || { conn: null, promise: null, isConnected: false };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Validate MongoDB URI
 */
function validateMongoURI(uri: string): void {
  if (!uri || uri.trim() === '') {
    throw new Error('MONGODB_URI is empty or undefined');
  }

  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    throw new Error('Invalid MONGODB_URI format. Must start with mongodb:// or mongodb+srv://');
  }

  // Check for placeholder values
  if (uri.includes('<password>') || uri.includes('<username>')) {
    throw new Error('MONGODB_URI contains placeholder values. Please replace <password> and <username> with actual values');
  }
}

async function connectDB() {
  // Validate URI before attempting connection
  validateMongoURI(MONGODB_URI);

  // Return cached connection if it's ready and connected
  if (cached.conn && cached.isConnected) {
    // Verify connection is actually still ready
    if (mongoose.connection.readyState === 1) {
      return cached.conn;
    }
    // Connection was closed, reset
    cached.conn = null;
    cached.promise = null;
    cached.isConnected = false;
  }

  if (!cached.promise) {
    const opts = {
      // Disable buffering commands - we'll handle connection explicitly
      bufferCommands: false,

      // Connection pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,

      // Timeout settings - increased for MongoDB Atlas/remote connections
      serverSelectionTimeoutMS: 15000,  // Increased from 5000ms to 15000ms
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,          // Added explicit connection timeout
      heartbeatFrequencyMS: 10000,      // Keep connection alive with heartbeat

      // Retry settings
      retryWrites: true,
      retryReads: true,
    };

    console.log('🔄 Connecting to MongoDB...');

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      cached.isConnected = mongoose.connection.readyState === 1;

      // Set up connection event handlers
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
        cached.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
        cached.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
        cached.isConnected = true;
      });

      const db = mongoose.connection.db;
      console.log(`✅ MongoDB connected successfully to database: ${db?.databaseName || 'unknown'}`);

      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    cached.isConnected = cached.conn.connection.readyState === 1;
  } catch (e) {
    cached.promise = null;
    cached.isConnected = false;

    const error = e as Error;
    console.error('❌ MongoDB connection error:', error.message);

    // Provide more helpful error messages
    if (error.message.includes('queryTxt')) {
      throw new Error('MongoDB Atlas DNS resolution failed. Please check your MONGODB_URI and network connection.');
    }

    if (error.message.includes('authentication')) {
      throw new Error('MongoDB authentication failed. Please check your username and password in MONGODB_URI.');
    }

    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      throw new Error('Cannot reach MongoDB server. Please check your network connection and firewall settings.');
    }

    if (error.message.includes('timeout')) {
      throw new Error('MongoDB connection timeout. Please check your network connection and MONGODB_URI settings.');
    }

    throw e;
  }

  return cached.conn;
}

/**
 * Get the current connection status
 */
export function getConnectionStatus(): string {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState as keyof typeof states] || 'unknown';
}

/**
 * Check if database is connected
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

/**
 * Disconnect from MongoDB (useful for cleanup in tests or serverless functions)
 */
export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    cached.isConnected = false;
    console.log('🔌 MongoDB disconnected');
  }
}

export default connectDB;

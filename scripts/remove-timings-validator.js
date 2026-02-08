const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function removeTimingsValidator() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

  // Extract database name from connection string
  const dbName = mongoUri.match(/\/([^/?]+)(\?|$)/)?.[1] || 'meditation-institute';

  console.log('Connecting to MongoDB...');
  console.log('Database:', dbName);
  console.log('URI:', mongoUri.replace(/:([^:@]+)@/, ':****@'));

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const eventsCollection = db.collection('events');

    // Get current collection options
    const options = await eventsCollection.options();
    console.log('Current collection validator:', JSON.stringify(options.validator, null, 2));

    // Remove the validator by running collMod
    await db.command({
      collMod: 'events',
      validator: {},
      validationLevel: 'off'
    });

    console.log('✓ Collection validator removed successfully');

    // Verify the change
    const newOptions = await eventsCollection.options();
    console.log('New collection validator:', JSON.stringify(newOptions.validator, null, 2));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

removeTimingsValidator();

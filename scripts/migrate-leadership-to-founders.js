/**
 * Migration script to update Content collection
 * - Changes 'leadership' type to 'founders'
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const contentCollection = db.collection('content');

    // Check current documents
    console.log('\n📊 Current content types:');
    const typeCounts = await contentCollection.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    typeCounts.forEach(({ _id, count }) => {
      console.log(`   ${_id || '(null)'}: ${count} documents`);
    });

    // Update 'leadership' to 'founders'
    console.log('\n🔄 Updating type from "leadership" to "founders"...');
    const result = await contentCollection.updateMany(
      { type: 'leadership' },
      { $set: { type: 'founders' } }
    );
    console.log(`✅ Updated ${result.modifiedCount} documents from 'leadership' to 'founders'`);

    // Verify the update
    console.log('\n📊 Updated content types:');
    const updatedTypeCounts = await contentCollection.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    updatedTypeCounts.forEach(({ _id, count }) => {
      console.log(`   ${_id || '(null)'}: ${count} documents`);
    });

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

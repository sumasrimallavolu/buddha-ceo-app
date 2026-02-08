/**
 * Ensure all Content documents have valid enum types
 * and update any 'leadership' to 'founders'
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function ensureValidTypes() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const contentCollection = db.collection('content');

    // Check for any documents with invalid types
    console.log('\n📊 Checking for invalid content types...');

    // Find any documents with type 'leadership' or other invalid types
    const invalidDocs = await contentCollection.find({
      type: { $in: ['leadership', 'members'] }
    }).toArray();

    if (invalidDocs.length > 0) {
      console.log(`Found ${invalidDocs.length} documents with invalid types`);

      // Update leadership to founders
      const leadershipResult = await contentCollection.updateMany(
        { type: 'leadership' },
        { $set: { type: 'founders' } }
      );
      console.log(`✅ Updated ${leadershipResult.modifiedCount} 'leadership' → 'founders'`);

      // Update members to mentors (if any exist)
      const membersResult = await contentCollection.updateMany(
        { type: 'members' },
        { $set: { type: 'mentors' } }
      );
      console.log(`✅ Updated ${membersResult.modifiedCount} 'members' → 'mentors'`);
    } else {
      console.log('✅ No invalid content types found');
    }

    // Verify current types
    console.log('\n📊 Current content types:');
    const typeCounts = await contentCollection.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    typeCounts.forEach(({ _id, count }) => {
      console.log(`   ${_id || '(null)'}: ${count} documents`);
    });

    console.log('\n✅ Validation complete!');
    console.log('\n⚠️  Please restart your development server to clear schema cache:');
    console.log('   1. Stop the server (Ctrl+C)');
    console.log('   2. Run: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

ensureValidTypes();

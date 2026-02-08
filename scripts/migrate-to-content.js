import mongoose from 'mongoose';

/**
 * MIGRATION SCRIPT: Move Photos and Resources to Content Collection
 *
 * This script migrates:
 * 1. Photo collection → Content collection (type: 'photos')
 * 2. Resource collection → Content collection (type: 'leadership')
 *
 * Run with: node scripts/migrate-to-content.js
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meditation-institute';

async function migrate() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const db = mongoose.connection.db;

  // Step 1: Migrate Photos to Content
  console.log('\n📸 Migrating Photos to Content collection...');

  const photos = await db.collection('photos').find({}).toArray();
  console.log(`Found ${photos.length} photos to migrate`);

  for (const photo of photos) {
    await db.collection('contents').updateOne(
      { 'migratedFrom.photo': photo._id.toString() },
      {
        $setOnInsert: {
          migratedFrom: { photo: photo._id.toString() },
        },
        $set: {
          title: photo.title,
          type: 'photos',
          status: photo.isActive ? 'published' : 'draft',
          content: {
            imageUrl: photo.imageUrl,
            description: photo.description || '',
            category: photo.category,
            likes: photo.likes || 0,
            views: photo.views || 0,
          },
          thumbnailUrl: photo.imageUrl,
          createdBy: photo.createdBy || new mongoose.Types.ObjectId(),
          createdAt: photo.createdAt,
          updatedAt: photo.updatedAt,
        }
      },
      { upsert: true }
    );
  }
  console.log(`✅ Migrated ${photos.length} photos`);

  // Step 2: Migrate Resources to Content (as leadership/resources)
  console.log('\n📚 Migrating Resources to Content collection...');

  const resources = await db.collection('resources').find({}).toArray();
  console.log(`Found ${resources.length} resources to migrate`);

  for (const resource of resources) {
    let contentData: any = {
      title: resource.title,
      description: resource.description,
      category: resource.category,
    };

    // Type-specific fields
    switch (resource.type) {
      case 'book':
        contentData.coverImage = resource.thumbnailUrl;
        contentData.author = resource.author;
        contentData.isbn = resource.isbn;
        contentData.pages = resource.pages;
        contentData.downloadUrl = resource.downloadUrl;
        contentData.purchaseUrl = resource.purchaseUrl;
        break;
      case 'video':
        contentData.videoUrl = resource.videoUrl;
        contentData.thumbnail = resource.thumbnailUrl;
        break;
      case 'magazine':
        contentData.coverImage = resource.thumbnailUrl;
        contentData.downloadUrl = resource.downloadUrl;
        break;
      case 'link':
        contentData.linkUrl = resource.linkUrl;
        break;
    }

    await db.collection('contents').updateOne(
      { 'migratedFrom.resource': resource._id.toString() },
      {
        $setOnInsert: {
          migratedFrom: { resource: resource._id.toString() },
        },
        $set: {
          title: resource.title,
          type: 'leadership', // All resources become leadership content
          status: resource.status === 'published' ? 'published' : 'draft',
          content: contentData,
          thumbnailUrl: resource.thumbnailUrl,
          createdBy: resource.createdBy || new mongoose.Types.ObjectId(),
          createdAt: resource.createdAt,
          updatedAt: resource.updatedAt,
          publishedAt: resource.status === 'published' ? resource.createdAt : undefined,
        }
      },
      { upsert: true }
    );
  }
  console.log(`✅ Migrated ${resources.length} resources`);

  // Step 3: Migrate Team Members to Content (as members)
  console.log('\n👥 Checking for team members to migrate...');

  const teamMemberContents = await db.collection('contents').find({ type: 'team_member' }).toArray();
  console.log(`Found ${teamMemberContents.length} team_member records`);

  for (const member of teamMemberContents) {
    await db.collection('contents').updateOne(
      { _id: member._id },
      {
        $set: {
          type: 'members',
          status: member.status || 'published',
        }
      }
    );
  }
  console.log(`✅ Converted ${teamMemberContents.length} team_member to members`);

  // Step 4: Migrate Achievements to Content (as leadership)
  console.log('\n🏆 Converting achievements to leadership...');

  const achievements = await db.collection('contents').find({ type: 'achievement' }).toArray();
  console.log(`Found ${achievements.length} achievement records`);

  for (const achievement of achievements) {
    await db.collection('contents').updateOne(
      { _id: achievement._id },
      {
        $set: {
          type: 'leadership',
        }
      }
    );
  }
  console.log(`✅ Converted ${achievements.length} achievement to leadership`);

  console.log('\n✨ Migration complete!');
  console.log('\n📊 Summary:');
  console.log(`  - Photos: ${photos.length} migrated`);
  console.log(`  - Resources: ${resources.length} migrated`);
  console.log(`  - Team Members: ${teamMemberContents.length} converted`);
  console.log(`  - Achievements: ${achievements.length} converted`);

  console.log('\n⚠️  IMPORTANT: After verifying the migration:');
  console.log('   1. Backup your database');
  console.log('   2. You can optionally remove the old collections:');
  console.log('      - db.photos.drop()');
  console.log('      - db.resources.drop()');

  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

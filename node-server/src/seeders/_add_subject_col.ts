import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1', port: 3306, user: 'root', password: 'root1234', database: 'mathverse',
    connectTimeout: 10000,
  });

  // Add subject column if not exists
  try {
    await conn.query("ALTER TABLE knowledge_node ADD COLUMN subject VARCHAR(20) DEFAULT 'math' AFTER domain");
    console.log('✅ Added subject column to knowledge_node');
  } catch (e: any) {
    if (e.message.includes('Duplicate column')) {
      console.log('ℹ️  subject column already exists in knowledge_node');
    } else {
      throw e;
    }
  }

  try {
    await conn.query("ALTER TABLE exam_question ADD COLUMN subject VARCHAR(20) DEFAULT 'math' AFTER node_id");
    console.log('✅ Added subject column to exam_question');
  } catch (e: any) {
    if (e.message.includes('Duplicate column')) {
      console.log('ℹ️  subject column already exists in exam_question');
    } else {
      throw e;
    }
  }

  try {
    await conn.query("ALTER TABLE knowledge_relation ADD COLUMN subject VARCHAR(20) DEFAULT 'math' AFTER from_node_id");
    console.log('✅ Added subject column to knowledge_relation');
  } catch (e: any) {
    if (e.message.includes('Duplicate column')) {
      console.log('ℹ️  subject column already exists in knowledge_relation');
    } else {
      throw e;
    }
  }

  await conn.end();
  console.log('\nSchema updated!');
}

main().catch(e => console.error('Failed:', e.message));

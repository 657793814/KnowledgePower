import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1', port: 3306, user: 'root', password: 'root1234', database: 'mathverse',
    connectTimeout: 5000
  });

  // Show table columns
  const tables = ['user', 'knowledge_node', 'knowledge_relation', 'exam_question'];
  for (const table of tables) {
    const [cols] = await conn.query(`SHOW COLUMNS FROM \`${table}\``);
    console.log(`\n=== ${table} ===`);
    (cols as any[]).forEach((c: any) => console.log(`  ${c.Field} (${c.Type}) default=${c.Default}`));
  }

  await conn.end();
}
main().catch(e => console.error(e.message));

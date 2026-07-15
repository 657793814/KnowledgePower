import mysql from 'mysql2/promise';

async function main() {
  const conn = await mysql.createConnection({
    host: '127.0.0.1', port: 3306, user: 'root', password: 'root1234', database: 'mathverse',
    connectTimeout: 5000
  });
  const [rows] = await conn.query('SELECT COUNT(*) AS cnt FROM knowledge_node');
  console.log('MySQL total nodes:', (rows as any)[0].cnt);
  await conn.end();
}
main().catch(e => console.error('Error:', e.message));

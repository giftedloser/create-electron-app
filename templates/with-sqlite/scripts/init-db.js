import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'app.db');
const db = new Database(dbPath);

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`).run();

console.log('Database initialized at', dbPath);

db.close();


import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'app.db');
const db = new Database(dbPath);

db.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)').run();

export function getUsers() {
  return db.prepare('SELECT * FROM users').all();
}

export function addUser(name) {
  return db.prepare('INSERT INTO users (name) VALUES (?)').run(name);
}

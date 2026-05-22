import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema/index.js';
let db = null;
export async function getDb() {
    if (db)
        return db;
    const connection = await mysql.createConnection(process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/misfit_ministries');
    db = drizzle(connection, { schema, mode: 'default' });
    return db;
}
export * from './schema/index.js';

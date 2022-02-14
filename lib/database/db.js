import { Low, JSONFile } from "lowdb";

const adapter = new JSONFile("db.json");

const db = new Low(adapter);

// init default data
db.data = db.data || { users: [], sessions: [] };

export default db;

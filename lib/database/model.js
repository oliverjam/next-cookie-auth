import crypto from "node:crypto";
import db from "./db.js";

function get(array, key, value) {
  for (const x of array) {
    if (x[key] === value) {
      return x;
    }
  }
  throw new Error(`Could not find ${key} '${value}'`);
}

function remove(array, key, value) {
  const index = array.findIndex((x) => x[key] === value);
  array.splice(index, 1);
}

export async function getUser(id) {
  await db.read();
  return get(db.data.users, "id", id);
}

export async function getUserByEmail(email) {
  await db.read();
  return get(db.data.users, "email", email);
}

export async function createUser(user) {
  await db.read();
  user.id = crypto.randomUUID();
  db.data.users.push(user);
  await db.write();

  return user;
}

export async function getSession(sid) {
  await db.read();
  return get(db.data.sessions, "sid", sid);
}

export async function createSession(sid, data) {
  await db.read();
  data.sid = sid;
  db.data.sessions.push(data);
  await db.write();
  return sid;
}

export async function removeSession(sid) {
  await db.read();
  remove(db.data.sessions, "sid", sid);
  await db.write();
  return sid;
}

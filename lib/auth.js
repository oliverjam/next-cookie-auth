import crypto from "node:crypto";
import * as model from "./database/model.js";

const isProd = process.env.NODE_ENV === "production";

export const cookie_options = `HttpOnly; Max-Age: 600; SameSite=lax; Path=/; Secure=${isProd}`;

export async function verify(email, password) {
  const saved_user = await model.getUserByEmail(email);
  if (saved_user.password !== password) {
    throw new Error("Authentication error");
  }
  // make sure we never accidentally return the pw in a response
  delete saved_user.password;
  return saved_user;
}

export async function saveSession(data) {
  const sid = crypto.randomBytes(18).toString("base64");
  return model.createSession(sid, data);
}

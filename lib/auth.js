const isProd = process.env.NODE_ENV === "production";

export const cookie_options = `HttpOnly; Max-Age: 600; SameSite=lax; Path=/; Secure=${isProd}`;

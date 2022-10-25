import { getUserByEmail, createSession } from "../../lib/database/model.js";
import { session_cookie } from "../../lib/cookies.js";

export default function log_in(req, res) {
  switch (req.method) {
    case "POST": {
      const { email, password } = req.body;
      const user = getUserByEmail(email);
      if (!user || user.password !== password) {
        throw new Error("Authentication error");
      }
      const session = createSession(user.id);
      // WARNING: you should really use a library that supports signed cookies to serialize this
      res.setHeader("set-cookie", session_cookie.write(session.id));
      res.redirect("/");
      break;
    }
    default:
      res.status(405).send("Method not allowed");
      break;
  }
}

import { cookie_options } from "../../lib/auth.js";
import { createUser, createSession } from "../../lib/database/model.js";

export default function sign_up(req, res) {
  switch (req.method) {
    case "POST": {
      const new_user = req.body;
      // WARNING: YOU SHOULD REALLY HASH THEIR PASSWORD HERE
      // THIS IS DANGEROUS AND NOT PRODUCTION-READY
      const user = createUser(new_user);
      const session = createSession(user.id);
      // WARNING: you should really use a libray that supports signed cookies to serialize this
      res.setHeader("set-cookie", `sid=${session.id}; ${cookie_options}`);
      res.redirect("/");
      break;
    }
    default:
      res.status(405).send("Method not allowed");
      break;
  }
}

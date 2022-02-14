import { cookie_options, saveSession } from "../../lib/auth.js";
import { createUser } from "../../lib/database/model.js";

export default async function sign_up(req, res) {
  switch (req.method) {
    case "POST": {
      const new_user = req.body;
      // WARNING: YOU SHOULD REALLY HASH THEIR PASSWORD HERE
      // THIS IS DANGEROUS AND NOT PRODUCTION-READY
      const user = await createUser(new_user);
      const sid = await saveSession({ user_id: user.id });
      // WARNING: you should really use a libray that supports signed cookies to serialize this
      res.setHeader("set-cookie", `sid=${sid}; ${cookie_options}`);
      res.redirect("/");
      break;
    }
    default:
      res.status(405).send("Method not allowed");
      break;
  }
}

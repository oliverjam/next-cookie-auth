import { cookie_options, verify, saveSession } from "../../lib/auth.js";

export default async function log_in(req, res) {
  switch (req.method) {
    case "POST": {
      const { email, password } = req.body;
      const user = await verify(email, password);
      const sid = await saveSession({ user_id: user.id });
      // WARNING: you should really use a library that supports signed cookies to serialize this
      res.setHeader("set-cookie", `sid=${sid}; ${cookie_options}`);
      res.redirect("/");
      break;
    }
    default:
      res.status(405).send("Method not allowed");
      break;
  }
}

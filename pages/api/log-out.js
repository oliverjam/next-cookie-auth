import { removeSession } from "../../lib/database/model.js";

export default async function log_in(req, res) {
  switch (req.method) {
    case "POST": {
      const sid = req.cookies.sid;
      await removeSession(sid);
      // setting cookie to expire in the past tells browser to remove it
      res.setHeader("set-cookie", `sid=0; Path=/; Expires=${new Date(0)}`);
      res.redirect("/");
      break;
    }
    default:
      res.status(405).send("Method not allowed");
      break;
  }
}

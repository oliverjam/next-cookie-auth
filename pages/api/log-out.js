import { removeSession } from "../../lib/database/model.js";
import { session_cookie } from "../../lib/cookies.js";

export default function log_in(req, res) {
  switch (req.method) {
    case "POST": {
      const sid = req.cookies.sid;
      removeSession(sid);
      // setting cookie to expire in the past tells browser to remove it
      res.setHeader("set-cookie", session_cookie.clear());
      res.redirect("/");
      break;
    }
    default:
      res.status(405).send("Method not allowed");
      break;
  }
}

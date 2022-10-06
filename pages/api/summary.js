import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req)
    //return res.status(403).json({ ok: false, message: "Permission denied" });
    if(user.isAdmin === true)
      return res.status(403).json({ ok: false, message: "Permission denied" });
    //compute DB summary
    const summary = readUsersDB()
    const countCustomer = summary.filter(x => x.isAdmin === false).length
    const countAdmin = summary.filter(x => x.isAdmin === true).length
    const countMoney = summary.filter(x => x.isAdmin === false).reduce((p,c) => p.money+c.money,0)
    //return response
    return res.json({ ok: true, userCount: countCustomer, adminCount: countAdmin, totalMoney: countMoney})
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}

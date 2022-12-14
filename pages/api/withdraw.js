import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function withdrawRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    //return res.status(403).json({ ok: false, message: "You do not have permission to withdraw" });
    const user = checkToken(req);
    if(user.isAdmin === false)
      return res.status(403).json({ ok: false, message: "You do not have permission to deposit" })
    const amount = req.body.amount;
    //validate body
    if (typeof amount !== "number")
      return res.status(400).json({ ok: false, message: "Invalid amount" });

    //check if amount < 1
    // return res.status(400).json({ ok: false, message: "Amount must be greater than 0" });
    if(amount < 1)
    return res.status(400).json({ ok: false, message: "Amount must be greater than 0" })
    //find and update money in DB (if user has enough money)
    //return res.status(400).json({ ok: false, message: "You do not has enough money" });
    const update = readUsersDB()
    const updateIdx = update.findIndex(x => x.username === user.username)
    if(update[updateIdx].money < amount){
      return res.status(400).json({ ok: false, message: "You do not has enough money" });
    }
    update[updateIdx].money -= amount
    writeUsersDB(update)
    //return response
    return res.json({ok: true, money: update[updateIdx].money})
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}

const express = require("express");
let myRouter = express.Router();
let{sendapival,gethome

}=require("../controller/controller");
myRouter.route("/")
.get(gethome);
myRouter.route("/t")
.post(sendapival);

module.exports=myRouter;
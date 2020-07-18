import express from "express";
const Router = express.Router();

import AuthenticationController from "./controllers/AuthenticationController";
import UserController from "./controllers/UserController";
const authentication = new AuthenticationController();
const user = new UserController();

Router.post("/auth/signin", authentication.signIn);
Router.post("/auth/signup", authentication.signUp);

Router.post("/recovery/verify_code", user.verifyCode);
Router.post("/recovery/create_code", user.createRecoveryCode);
Router.post("/recovery/change_pass", user.changePassword);

Router.get("/user/fetch", user.fetch);
Router.get("/user/exists", user.userExists);

Router.get("*", (req, res) => {
  res.send('yey')
})

export default Router;

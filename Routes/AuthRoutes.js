import express from "express";
import { login, register } from "../Controller/AuthCOntroller.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);

export default AuthRouter;

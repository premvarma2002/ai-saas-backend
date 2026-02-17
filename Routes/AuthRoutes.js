import express from "express";
import {
    forgetPassword,
    login,
    logout,
    refreshToken,
    register,
} from "../Controller/AuthCOntroller.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.post("/forget-password", forgetPassword);
AuthRouter.post("/logout", logout);
AuthRouter.post("/refresh-token", refreshToken);
export default AuthRouter;

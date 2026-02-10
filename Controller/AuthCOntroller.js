import Auth from "../Schema/AuthSchema.js";
import { errorHandler } from "../Utils/ErrorHandler.js";
import { SuccessHandler } from "../Utils/SuccessHandler.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return errorHandler(res, {}, 400, "All fields are required");
        }
        // Check if user already exists
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return errorHandler(res, {}, 400, "User already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(5);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new Auth({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        return SuccessHandler(res, 201, "User registered successfully", {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            plan: newUser.plan,
            role: newUser.role,
        });
    } catch (error) {
        console.log("this error from register user controller", error);
        return errorHandler(res, error, 500, "Server error");
    }
};

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return errorHandler(res, {}, 400, "All fields are required");
        }
        // Check if user exists
        const user = await Auth.findOne({ email });
        if (!user) {
            return errorHandler(res, {}, 400, "User not found");
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorHandler(res, {}, 400, "Invalid password");
        }
        return SuccessHandler(res, 200, "User logged in successfully", {
            id: user._id,
            name: user.name,
            email: user.email,
            plan: user.plan,
            role: user.role,
        });
    } catch (error) {
        return errorHandler(res, error, 500, "Server error");
        console.log("this error from login user controller");
    }
};

export { register, login };

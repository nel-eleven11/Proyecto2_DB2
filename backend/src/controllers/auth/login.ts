import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRET_KEY as string;
const BE_ADMIN_USR = process.env.BE_ADMIN_USR as string; 
const BE_ADMIN_PWD = process.env.BE_ADMIN_PWD as string; 
const BE_CLIENT_USR = process.env.BE_CLIENT_USR as string;
const BE_CLIENT_PWD = process.env.BE_CLIENT_PWD as string;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export const login: RequestHandler = async (req, res) => {
  try {
    const { user, password } = req.body;
 
    if (!((user === BE_ADMIN_USR && password === BE_ADMIN_PWD) || (user === BE_CLIENT_USR && password === BE_CLIENT_PWD))) {
      res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign(
      { user }, 
      SECRET_KEY, 
      { expiresIn: "1h" } 
    );

    
    res.status(200).json({
      role: user,  
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


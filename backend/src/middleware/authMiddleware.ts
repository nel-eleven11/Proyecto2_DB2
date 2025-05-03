import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY || 'your-secret-key';
const TOKEN_EXPIRATION = '1h'; 

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    req.user = decoded; 

    const newToken = jwt.sign({ email: decoded.email }, secretKey, {
      expiresIn: TOKEN_EXPIRATION
    });

    res.setHeader('Authorization', `Bearer ${newToken}`);

    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

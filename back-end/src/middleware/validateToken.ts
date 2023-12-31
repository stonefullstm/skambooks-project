import { NextFunction, Request, Response } from 'express';
import statusCodes from '../statusCodes';
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const { authorization: token } = req.headers;
  if (!token) return res.status(statusCodes.UNAUTHORIZED).json({
    ok: false,
    status: statusCodes.UNAUTHORIZED,
    message: 'Token not found',
    data: {}
   });
  try {
    const user = jwt.verify(token, JWT_SECRET as string);
    req.body.user = user;
    next();
  } catch (e) {
    return res.status(statusCodes.UNAUTHORIZED).json({
      ok: false,
      status: statusCodes.UNAUTHORIZED,
      message: 'Expired or invalid token',
      data: {}
     });
  } 
};

export default validateToken;

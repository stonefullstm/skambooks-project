const jwt = require('jsonwebtoken');
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import readersService from '../services/readers.service';
import statusCodes from '../statusCodes';
import { internalError } from '../utils';
require('dotenv/config');

const secret = process.env.JWT_SECRET || 'gatopreto';
const READER_NOT_FOUND = 'Reader not found';
const OK = 'OK';

const getReaderById = async ( req: Request, res: Response) => {
  const { id } = req.body.user;
  const result = await readersService.getReaderById(Number(id));
  if (result) {
    return res.status(statusCodes.OK).json({
      ok: true,
      status: statusCodes.OK,
      message: OK,
      data: result
    });
  }
  return res.status(statusCodes.NOT_FOUND).json({
    ok: false,
    status: statusCodes.NOT_FOUND,  
    message: READER_NOT_FOUND,
    data: {} });
};

const getAllReaders = async (req: Request, res: Response) => {
  const result = await readersService.getAllReaders();
  if (!result) {
    return res.status(statusCodes.NOT_FOUND).json({
      ok: false,
      status: statusCodes.NOT_FOUND, 
      message: READER_NOT_FOUND,
      data: {}});
  }
  return res.status(statusCodes.OK).json({
    ok: true,
    status: statusCodes.OK,
    message: OK,
    data: result});
}

const getReaderByEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await readersService.getReaderByEmail(email);
  
  if (!user || !user.id) {
    return res.status(statusCodes.NOT_FOUND).json({
      ok: false,
      status: statusCodes.NOT_FOUND,
      message: 'User not found',
      data: {}
    });
  };
  if (!bcrypt.compareSync(password, user.password) ) {
    return res.status(statusCodes.BAD_REQUEST).json({
      ok: false,
      status: statusCodes.BAD_REQUEST,
      message: 'Invalid password',
      data: {}
    });
  }
  const userData = { 
    id: user.id,
    email,
  }; 
  const jwtConfig = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };
  const token = jwt.sign( userData, secret as string, jwtConfig);
  console.log(secret);
  
  res.status(statusCodes.OK).json({
    ok: true,
    status: statusCodes.OK,
    message: 'OK',
    data: {token} });
};

const createReader = async ( req: Request, res: Response) => {
  const { email } = req.body;
  const user = await readersService.getReaderByEmail(email);
  if (user && user.email) {
    return res.status(statusCodes.BAD_REQUEST).json({
      ok: false,
      status: statusCodes.BAD_REQUEST,
      message: 'E-mail already exists',
      data: {} });
  }
  const result = await readersService.createReader(req.body);
  
  if (result) {
    return res.status(statusCodes.CREATED).json({
      ok: true,
      status: statusCodes.CREATED,
      message: 'Created user',
      data: req.body });
  }
  return res.status(statusCodes.ERROR).json({
    ok: false,
    status: statusCodes.ERROR,
    message: 'Error',
    data: {} });
};

const updateReader = async ( req: Request, res: Response) => {
  const { id } = req.body.user;
  const reader = await readersService.getReaderById(Number(id));
  if (!reader) {
    return res.status(statusCodes.NOT_FOUND).json({
      ok: false,
      status: statusCodes.NOT_FOUND,
      message: 'Reader not found',
      data: {}});
  }
  const { user: _, ...bodyWithoutUser } = req.body;
  
  const updatedQty = await readersService.updateReader(bodyWithoutUser, Number(id));
  if (updatedQty) {
    return res.status(statusCodes.OK).json({
      ok: true,
      status: statusCodes.OK,
      message: 'OK',
      data: { id, ...req.body }});
  }
  return res.status(statusCodes.ERROR).json(internalError);
};

const deleteReader = async ( req: Request, res: Response) => {
  const { id } = req.body.user;
  const result = await readersService.getReaderById(Number(id));
  if (!result) {
    return res.status(statusCodes.NOT_FOUND).json({      
      ok: false,
      status: statusCodes.NOT_FOUND,
      message: 'Reader not found',
      data: {}});
  }
  const reader = await readersService.deleteReader(Number(id));
  if (reader) {
    return res.status(statusCodes.OK).json({ message: `Reader deleted: ${id}`});
  };
  return res.status(statusCodes.ERROR).json(internalError);
  
};

export default { getReaderById,
  getAllReaders, 
  createReader, 
  getReaderByEmail, 
  updateReader, 
  deleteReader };

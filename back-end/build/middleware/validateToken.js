"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const statusCodes_1 = __importDefault(require("../statusCodes"));
const jwt = require('jsonwebtoken');
const { JWTSECRET } = process.env;
const validateToken = (req, res, next) => {
    const { authorization: token } = req.headers;
    if (!token)
        return res.status(statusCodes_1.default.UNAUTHORIZED).json({
            ok: false,
            status: statusCodes_1.default.UNAUTHORIZED,
            message: 'Token not found',
            data: {}
        });
    try {
        const user = jwt.verify(token, JWTSECRET);
        req.body.user = user;
        next();
    }
    catch (e) {
        return res.status(statusCodes_1.default.UNAUTHORIZED).json({
            ok: false,
            status: statusCodes_1.default.UNAUTHORIZED,
            message: 'Expired or invalid token',
            data: {}
        });
    }
};
exports.default = validateToken;

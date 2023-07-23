"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
const bcrypt = __importStar(require("bcrypt"));
const readers_service_1 = __importDefault(require("../services/readers.service"));
const statusCodes_1 = __importDefault(require("../statusCodes"));
const utils_1 = require("../utils");
require('dotenv/config');
const secret = process.env.JWT_SECRET || 'gatopreto';
const READER_NOT_FOUND = 'Reader not found';
const OK = 'OK';
const getReaderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.user;
    const result = yield readers_service_1.default.getReaderById(Number(id));
    if (result) {
        return res.status(statusCodes_1.default.OK).json({
            ok: true,
            status: statusCodes_1.default.OK,
            message: OK,
            data: result
        });
    }
    return res.status(statusCodes_1.default.NOT_FOUND).json({
        ok: false,
        status: statusCodes_1.default.NOT_FOUND,
        message: READER_NOT_FOUND,
        data: {}
    });
});
const getAllReaders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield readers_service_1.default.getAllReaders();
    if (!result) {
        return res.status(statusCodes_1.default.NOT_FOUND).json({
            ok: false,
            status: statusCodes_1.default.NOT_FOUND,
            message: READER_NOT_FOUND,
            data: {}
        });
    }
    return res.status(statusCodes_1.default.OK).json({
        ok: true,
        status: statusCodes_1.default.OK,
        message: OK,
        data: result
    });
});
const getReaderByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield readers_service_1.default.getReaderByEmail(email);
    if (!user || !user.id) {
        return res.status(statusCodes_1.default.NOT_FOUND).json({
            ok: false,
            status: statusCodes_1.default.NOT_FOUND,
            message: 'User not found',
            data: {}
        });
    }
    ;
    if (!bcrypt.compareSync(password, user.password)) {
        return res.status(statusCodes_1.default.BAD_REQUEST).json({
            ok: false,
            status: statusCodes_1.default.BAD_REQUEST,
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
    const token = jwt.sign(userData, secret, jwtConfig);
    console.log(secret);
    res.status(statusCodes_1.default.OK).json({
        ok: true,
        status: statusCodes_1.default.OK,
        message: 'OK',
        data: { token }
    });
});
const createReader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield readers_service_1.default.getReaderByEmail(email);
    if (user && user.email) {
        return res.status(statusCodes_1.default.BAD_REQUEST).json({
            ok: false,
            status: statusCodes_1.default.BAD_REQUEST,
            message: 'E-mail already exists',
            data: {}
        });
    }
    const result = yield readers_service_1.default.createReader(req.body);
    if (result) {
        return res.status(statusCodes_1.default.CREATED).json({
            ok: true,
            status: statusCodes_1.default.CREATED,
            message: 'Created user',
            data: req.body
        });
    }
    return res.status(statusCodes_1.default.ERROR).json({
        ok: false,
        status: statusCodes_1.default.ERROR,
        message: 'Error',
        data: {}
    });
});
const updateReader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.user;
    const reader = yield readers_service_1.default.getReaderById(Number(id));
    if (!reader) {
        return res.status(statusCodes_1.default.NOT_FOUND).json({
            ok: false,
            status: statusCodes_1.default.NOT_FOUND,
            message: 'Reader not found',
            data: {}
        });
    }
    const _a = req.body, { user: _ } = _a, bodyWithoutUser = __rest(_a, ["user"]);
    const updatedQty = yield readers_service_1.default.updateReader(bodyWithoutUser, Number(id));
    if (updatedQty) {
        return res.status(statusCodes_1.default.OK).json({
            ok: true,
            status: statusCodes_1.default.OK,
            message: 'OK',
            data: Object.assign({ id }, req.body)
        });
    }
    return res.status(statusCodes_1.default.ERROR).json(utils_1.internalError);
});
const deleteReader = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.user;
    const result = yield readers_service_1.default.getReaderById(Number(id));
    if (!result) {
        return res.status(statusCodes_1.default.NOT_FOUND).json({
            ok: false,
            status: statusCodes_1.default.NOT_FOUND,
            message: 'Reader not found',
            data: {}
        });
    }
    const reader = yield readers_service_1.default.deleteReader(Number(id));
    if (reader) {
        return res.status(statusCodes_1.default.OK).json({ message: `Reader deleted: ${id}` });
    }
    ;
    return res.status(statusCodes_1.default.ERROR).json(utils_1.internalError);
});
exports.default = { getReaderById,
    getAllReaders,
    createReader,
    getReaderByEmail,
    updateReader,
    deleteReader };

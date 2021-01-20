"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Users_model_1 = require("../models/Users.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middleware/autenticacion");
const usersRoutes = express_1.Router();
usersRoutes.get('/all', (req, res) => {
    Users_model_1.Usuario.find().then(users => {
        res.json({
            users
        });
    });
});
usersRoutes.post('/login', (req, res) => {
    Users_model_1.Usuario.findOne({ email: req.body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                error: 9002,
                msg: 'El email o la contraseña no coinciden'
            });
        }
        if (bcrypt_1.default.compareSync(req.body.password, userDB.password)) {
            const token = token_1.default.getJWToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            userDB.token = token;
            Users_model_1.Usuario.findByIdAndUpdate({ _id: userDB._id }, userDB).then(response => {
                return res.json({
                    error: 0,
                    token: token
                });
            });
        }
        else {
            return res.json({
                error: 9002,
                msg: 'El email o la contraseña no coinciden***'
            });
        }
    });
});
usersRoutes.put('/update', autenticacion_1.verificaToken, (req, res) => {
    const usuario = req.body;
    usuario.token = req.get('x-token');
    Users_model_1.Usuario.findById({ _id: req.usuario._id })
        .then(resp => {
        if ((resp === null || resp === void 0 ? void 0 : resp.token) === usuario.token) { //Si el token no coincide con el guardado en la BD no actualiza
            Users_model_1.Usuario.findByIdAndUpdate({ _id: req.usuario._id }, usuario, { new: true })
                .populate('-password')
                .then((userUpd) => {
                //Genero token
                const token = token_1.default.getJWToken({
                    _id: userUpd._id,
                    nombre: userUpd.nombre,
                    email: userUpd.email,
                    avatar: userUpd.avatar
                });
                return res.json({
                    error: 0,
                    token: token
                });
            }).catch(err => {
                res.json({
                    error: 9001,
                    msg: 'El usuario no existe en la base de datos'
                });
            });
        }
        else {
            res.json({
                error: 9999,
                msg: 'El token no coincide con el guardado'
            });
        }
    });
});
usersRoutes.post('/insert', (req, res) => {
    const user = {
        nombre: '',
        avatar: '',
        email: '',
        password: '',
        fechaNacimiento: ''
    };
    user.nombre = req.body.nombre;
    user.avatar = req.body.avatar;
    user.email = req.body.email;
    user.password = bcrypt_1.default.hashSync(req.body.password, 10);
    user.fechaNacimiento = req.body.fechaNacimiento;
    Users_model_1.Usuario.create(user).then(userDB => {
        const token = token_1.default.getJWToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avatar: userDB.avatar
        });
        userDB.token = token;
        Users_model_1.Usuario.findByIdAndUpdate({ _id: userDB._id }, userDB).then(response => {
            return res.json({
                error: 0,
                token: token
            });
        });
    }).catch(err => {
        if (err.code === 11000) {
            return res.json({
                error: 9000,
                msg: 'El email ya está registrado'
            });
        }
        return res.json({
            error: 9001,
            msg: 'Upss! Algo salió mal!'
        });
    });
});
exports.default = usersRoutes;

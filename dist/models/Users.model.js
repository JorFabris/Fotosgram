"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    avatar: {
        type: String,
        default: 'av-1.png'
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    token: {
        type: String,
        unique: true
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La fecha de nacimiento es necesaria']
    }
});
exports.Usuario = mongoose_1.model('Usuario', userSchema);

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autenticacion_1 = require("../middleware/autenticacion");
const postRoutes = express_1.Router();
postRoutes.post('/subir/post', [autenticacion_1.verificaToken], (req, res) => {
    res.json({
        error: 0
    });
});
exports.default = postRoutes;

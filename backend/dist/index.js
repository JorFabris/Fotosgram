"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const server_1 = __importDefault(require("./classes/server"));
const Users_routes_1 = __importDefault(require("./routes/Users.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const Posts_routes_1 = __importDefault(require("./routes/Posts.routes"));
const server = new server_1.default();
const logger = require('morgan');
const dbAppName = 'db-fotosgram';
//Conectar DB
mongoose_1.default.connect(`mongodb://localhost:27017/${dbAppName}`, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
    if (err)
        throw err;
    console.log(`Base de datos ${dbAppName} conectada`);
});
//Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
//Morgan
server.app.use(logger('dev'));
//Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//Rutas de la app
server.app.use('/api/user', Users_routes_1.default);
server.app.use('/api/post', Posts_routes_1.default);

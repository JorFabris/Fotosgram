import mongoose from 'mongoose';
import Server from "./classes/server";
import usersRoutes from "./routes/Users.routes";
import bodyParser from 'body-parser';
import postRoutes from './routes/Posts.routes';

const server = new Server();

const logger = require('morgan'); 

const dbAppName = 'db-fotosgram';

//Conectar DB
mongoose.connect(`mongodb://localhost:27017/${dbAppName}`,
                    {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify: false},(err)=>{
                        if(err)throw err;


                        console.log(`Base de datos ${dbAppName} conectada`);
                        
                    })


//Levantar express
server.start( ()=>{
    console.log(`Servidor corriendo en puerto ${server.port}`);
})

//Morgan
server.app.use(logger('dev'))

//Body parser
server.app.use( bodyParser.urlencoded({ extended:true }) );
server.app.use( bodyParser.json() );

//Rutas de la app
server.app.use( '/api/user', usersRoutes );
server.app.use( '/api/post', postRoutes  );
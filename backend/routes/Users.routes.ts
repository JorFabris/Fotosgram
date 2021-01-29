import { Router, Request, Response } from "express";
import { Usuario } from "../models/Users.model";
import bcrypt from 'bcrypt';
import Token from "../classes/token";
import { verificaToken } from "../middleware/autenticacion";


const usersRoutes = Router();


usersRoutes.get('/all', (req:Request, res:Response) => {

    Usuario.find().then(users => {
        res.json({
            users
        });
    })

});

usersRoutes.post('/login', (req:Request, res:Response) => {

    Usuario.findOne({email: req.body.email}, (err:any, userDB:any) =>{
        if(err) throw err;

        if(!userDB){
            return res.json({
                error:9002,
                msg:'El email o la contraseña no coinciden'
            })
        }

        if( bcrypt.compareSync(req.body.password, userDB.password) ){
            const token = Token.getJWToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            userDB.token = token;

            Usuario.findByIdAndUpdate({_id:userDB._id},userDB).then(response =>{
                return res.json({
                    error:0,
                    token: token
                });
            });
          
        } else {
            return res.json({
                error:9002,
                msg:'El email o la contraseña no coinciden***'
            })
        }
    })

});

usersRoutes.put('/update', verificaToken , (req:any, res:Response) => {

    const usuario = req.body;
    usuario.token = req.get('x-token');

    Usuario.findById({_id:req.usuario._id})
    .then(resp => {
        if(resp?.token === usuario.token){//Si el token no coincide con el guardado en la BD no actualiza

            Usuario.findByIdAndUpdate({_id:req.usuario._id}, usuario, {new: true})
            .populate('-password')
            .then((userUpd:any) =>{
                //Genero token
                const token = Token.getJWToken({
                    _id: userUpd._id,
                    nombre: userUpd.nombre,
                    email: userUpd.email,
                    avatar: userUpd.avatar
                });
        
                return res.json({
                    error:0,
                    token: token
                });
        
            }).catch(err =>{
                res.json({
                    error:9001,
                    msg:'El usuario no existe en la base de datos'
                })
            });

        } else {
            res.json({
                error:9999,
                msg:'El token no coincide con el guardado'
            })
        }
    })
});

usersRoutes.post('/create', ( req:Request, res:Response ) => {

   const user = {
    nombre: '',
    avatar: '',
    email:'',
    password:'',
    fechaNacimiento:''
   };

   user.nombre          = req.body.nombre;
   user.avatar          = req.body.avatar;
   user.email           = req.body.email;
   user.password        = bcrypt.hashSync(req.body.password, 10);
   user.fechaNacimiento = req.body.fechaNacimiento;

   Usuario.create( user ).then(userDB =>{
    const token = Token.getJWToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
        avatar: userDB.avatar
    });
    userDB.token = token;

    Usuario.findByIdAndUpdate({_id:userDB._id},userDB).then(response =>{
        return res.json({
            error:0,
            token: token
        });
    });

   }).catch(err =>{

        if(err.code === 11000){
            return res.json({
                error:9000,
                msg:'El email ya está registrado'
            });
        }

        return res.json({
            error:9001,
            msg:'Upss! Algo salió mal!'
        });
      
   })



});



export default usersRoutes;
import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({

    nombre:{
        type:String,
        required:[true,'El nombre es necesario']
    },
    avatar:{
        type:String,
        default:'av-1.png'
    },
    email:{
        type: String,
        unique: true,
        required:[true, 'El email es necesario']
    },
    password:{
        type:String,
        required:[true, 'La contraseña es necesaria']
    },
    token:{
        type:String,
        unique:true
    },
    fechaNacimiento:{
        type:Date,
        required:[true, 'La fecha de nacimiento es necesaria']
    }

});

interface IUsuario extends Document {

    nombre:String;
    
    avatar:String;
    
    email:String;
    
    password:String;

    token:String;
    
    fechaNacimiento:Date;
    
}

export const Usuario = model<IUsuario>('Usuario', userSchema);
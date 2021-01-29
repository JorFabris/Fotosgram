

import { Model, Schema, Document, model } from 'mongoose';

const postSchema = new Schema({

    created:{
        type:Date
    },
    mensaje:{
        type:String
    },
    img:[{
        type:String,
    }],
    coords:{
        type:String
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required:[true, 'El usuario es obligatorio']
    }
});

postSchema.pre<IPost>('save', function( next ){

    this.created = new Date();

    next();
});

interface IPost extends Document{
    created:Date,
    mensaje:String,
    coords:String,
    img:String[],
    usuario:String
}


export const Post = model<IPost>('Post', postSchema);
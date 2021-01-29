import { Response, Router } from "express";
import { verificaToken } from "../middleware/autenticacion";
import { Post } from "../models/Post.model";


const postRoutes =  Router();


postRoutes.post('/save/post', [verificaToken], (req:any, res:Response) =>{

    const post = req.body;

    Post.create(post).then( async (postDB) =>{

        await postDB.populate('usuario', '-password').execPopulate();

        res.json({
            error:0,
            post:postDB
        })
        
    }).catch(err =>{
        res.json({
            error:9002,
            msg:"El post no se guardo correctamente"
        })
    });
});

postRoutes.get('/get/all/paged', [verificaToken], async (req:any, res:Response) =>{

    const post = req.body;

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;

    const posts = await Post.find()
                            .sort({ _id: -1 })
                            .skip(skip)
                            .limit(10)
                            .populate('usuario', '-password')
                            .exec();

    res.json({
        error:0,
        pagina,
        posts
    })
});




export default postRoutes;
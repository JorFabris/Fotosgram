import { Response, Router } from "express";
import { verificaToken } from "../middleware/autenticacion";


const postRoutes =  Router();


postRoutes.post('/subir/post', [verificaToken], (req:any, res:Response) =>{

    res.json({
        error:0
    })

});




export default postRoutes;
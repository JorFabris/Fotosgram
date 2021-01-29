import jwt from 'jsonwebtoken';

export default class Token{

    private static seed:string = 'seed-token-fotosgram-app'
    private static caducidad:string = '30d';

    constructor(){}

    static getJWToken( payload:any ):string {

        return jwt.sign({
            usuario:payload
        },this.seed, {expiresIn:this.caducidad});

    }

    static comprobarToken(token:string) {
        return new Promise( (resolve, reject) =>{

            jwt.verify(token, this.seed, (err, decoded) => {
                if(err){
                    reject();
                } else {
                    resolve(decoded);
                }
            })

        });
    }
    
}
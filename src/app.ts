import {GraphQLServer, PubSub} from 'graphql-yoga'
import cors from 'cors';
import logger from 'morgan';
import helmet from 'helmet';
import schema from './schema';
import decodeJWT from "./utils/decodeJWT";
import { NextFunction, Response } from 'express';


class App{
    public app: GraphQLServer;
    public pubSub: any;
    constructor(){
        this.pubSub = new PubSub()
        this.pubSub.ee.setMaxListeners(99);
        //context여기 정의가능
        this.app = new GraphQLServer({
            schema: schema,
            context: req=>{
                console.log("app req = ", req);
                //web socket connecion임
                //console.log("connect cu = ", req.connection.context.currentUser);
                const { connection: { context = null } = {} } = req
                return{
                    req: req.request,
                    pubSub: this.pubSub,
                    context
                }               
            }
        })
        this.middlewares();
    }

    private middlewares = (): void=>{
        this.app.express.use(cors())
        this.app.express.use(logger("dev"))
        this.app.express.use(helmet())
        this.app.express.use(this.jwt);
    }

    private jwt = async (req, res: Response, next: NextFunction): Promise<void> => {
        const token = req.get("X-JWT");
        if (token) {
            const user = await decodeJWT(token);
            console.log(user);
            if(user){
                req.user = user;
            }else{
                req.user = undefined;
            }
        }
        next();
      };
}

export default new App().app;


//타입 스크립트는 알파벳순으로 임포트 모듈먼저 그다음 라이브러리
import dotenv from "dotenv"
dotenv.config()
import {Options} from 'graphql-yoga'
import app from './app';
import decodeJWT from './utils/decodeJWT'
import {createConnection} from "typeorm"
import connectionOptions from './ormConfig';


const PORT : number | string = process.env.PORT || 4004;
const PLAYGROUND_ENDPOINT : string = "/playground";
const GRAPHQL_ENDPOINT : string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOptions : Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT,
    //소켓 연결 시작할때 인증하면 그거 기억함
    subscriptions:{
        path: SUBSCRIPTION_ENDPOINT,
        onConnect: async connectionParams => {
        const token = connectionParams["X-JWT"];
        console.log(connectionParams["X-JWT"]);
        if (token) {
            const user = await decodeJWT(token);
            console.log(user);
            if (user) {
            return {
                currentUser: user
            };
            }
        }
        throw new Error("No JWT. Can't subscribe");
        }

    }
}

const handleAppStart  = ()=>console.log(`listen on port ${PORT}`)

createConnection(connectionOptions).then(()=>{
    app.start(appOptions, handleAppStart)
})
.catch(error => console.log(error));


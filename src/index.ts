
//타입 스크립트는 알파벳순으로 임포트 모듈먼저 그다음 라이브러리
import dotenv from "dotenv"
dotenv.config()
import {Options} from 'graphql-yoga'
import app from './app';
import {createConnection} from "typeorm"
import connectionOptions from './ormConfig';




const PORT : number | string = process.env.PORT || 4004
const PLAYGROUND_ENDPOINT : string = "/playground"
const GRAPHQL_ENDPOINT : string = "/graphql"

const appOptions : Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT
}

const handleAppStart  = ()=>console.log(`listen on port ${PORT}`)

createConnection(connectionOptions).then(()=>{
    app.start(appOptions, handleAppStart)
})
.catch(error => console.log(error));


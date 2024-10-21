import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'; // Import cookie-parser

import { adminRouter } from './Routes/AdminRoute.js';


const app = express()
app.use(cookieParser()); // Use cookie-parser middleware



app.use(cors({
    origin:["http://localhost:5173"],
    methods:['GET', 'POST', 'PUT','DELETE'],
    credentials:true
}))
app.use(express.json())
app.use('/auth',adminRouter)




app.listen(8081, ()=> {
    console.log("running")
})
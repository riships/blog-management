import express from 'express';
import dbconnection from './config/dbConfig.js';
import userRouter from './routes/user.routes.js';
import blogsRouter from './routes/blogs.routes.js';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
const app = express()
const port = 5000 || process.env.PORT;



app.use(express.json());

app.use(express.static('./uploads'))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
dbconnection();
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'blog-auth-token'],
    credentials: true
}));


app.use('/api/user', userRouter);
app.use('/api/blogs', blogsRouter);



// Error handling middleware should be last
app.use(errorHandler);

app.listen(port, (err) => {
    if (!err) {
        console.log(`Example app listening on port ${port}!`)
    }
})
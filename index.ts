import express from 'express';
import dotenv from 'dotenv';
import {dotenvConfig} from './dotenvConfig';

const PORT = dotenvConfig.parsed?.PORT || 3000;

const app = express();

import projectRoute from "./routes/projectRoute.js";
import userRoute from './routes/userRoute.js';
import taskRoute from './routes/taskRoute.js';
import {validateBodyMiddleware} from "./middlewares/validateMiddleware";
import {errorMiddleware} from "./middlewares/errorMiddleware";

app.use(express.json()); // должен быть для работы с валидацией


// @ts-ignore
app.use(validateBodyMiddleware) // должен быть перед роутами

app.use('/project', projectRoute);
app.use('/user', userRoute);
app.use('/task', taskRoute);


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorMiddleware) // Должен быть в конце

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
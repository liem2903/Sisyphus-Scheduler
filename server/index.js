import express from 'express';
import auth from './routes/auth.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log("Incoming cookies:", req.cookies);
//   next();
// });

app.use('/api/auth', auth);

app.listen(port, () => console.log("Server started on port 4000"))
export default app;

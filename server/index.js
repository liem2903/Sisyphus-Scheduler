import express from 'express';
import auth from './routes/auth.js';
import friend from './routes/friend.js';
import user from './routes/user.js';
import group from './routes/group.js';
import calendar from './routes/calendar.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; 
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', auth);
app.use('/api/calendar', calendar);
app.use('/api/friend', friend);
app.use('/api/user', user);
app.use('/api/group', group);
app.listen(port, () => console.log(`Server started on port ${port}`))
export default app;

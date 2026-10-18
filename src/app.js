const express = require('express')
const cookieparser = require('cookie-parser')
const authRouter = require('./routes/auth.routes.js')

const app = express();

// Middkewares
app.use(express.json());
app.use(cookieparser());

//All auth related routes
app.use('/api/auth', authRouter);
module.exports = app;
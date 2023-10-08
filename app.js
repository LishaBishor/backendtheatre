const express=require('express');
const mongoose = require('mongoose');
const morgan=require('morgan');
const cors=require('cors');
const app=new express();
const path=require('path');
require('dotenv').config();
app.use(morgan('dev'));
require("./db/dbconnection")
app.use(cors());
app.use(express.static(path.join(__dirname,'/build')));
const custapi=require('./Routes/customerRouter');
const logapi=require('./Routes/loginRouter');
const movieapi=require('./Routes/movieRouter');
const ticketapi=require('./Routes/ticketRouter');
const emailapi=require('./Routes/emailRouter')
app.use('/api',custapi);
app.use('/api',logapi);
app.use('/api',movieapi);
app.use('/api',ticketapi);
app.use('/api',emailapi);
app.get('/*',function(req,res){
    res.sendFile(path.join(__dirname,'/build/index.html'));
});
const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
})

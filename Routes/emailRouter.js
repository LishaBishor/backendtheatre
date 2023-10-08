const express=require('express');
const router=express.Router();
const nodemailer = require("nodemailer")
require('dotenv').config();

const transporter = nodemailer.createTransport({
  // host: "localhost",
    service:"gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "kaverdas6873@gmail.com",
       pass: process.env.PASS,
   
    },
  });

router.get('/',(req,res)=>{
    res.send('Hi, This is Get')
})
router.post('/send/:seats/:rmail',async(req,res)=>{
    
    res.json({message:"email sent"})  
    let bseats=req.params.seats;
    let rmail=req.params.rmail;
    console.log(bseats,rmail);
    const info = await transporter.sendMail({
        from: "kaverdas6873@gmail.com", // sender address
        to: rmail, // list of receivers
        subject: "TestingEnv", // Subject line
        text: "You booked your seats successfully. Seat numbers: "+bseats, // plain text body
      //  html: "<b>Hello world?</b>", // html body
      });
      console.log("Message sent: %s", info.messageId);

})
module.exports=router;
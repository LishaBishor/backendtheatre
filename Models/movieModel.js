const mongoose=require('mongoose');
const movieSchema=mongoose.Schema({
moviename:String,
movieimage:String,
category:String,
Languages:String,
poster:String,
description:String,
screen:String,
avgrating:Number,
tktsold:Number,
tktcharge:Number,
timings:[String],
castdetails:
    
        [{actorname: String,actorimage: String }]  
    
,
userfeedback:[{username:String,review:String,addreview:String,rating:Number}]
});

const movieData=mongoose.model('moviedetail',movieSchema);
module.exports=movieData;
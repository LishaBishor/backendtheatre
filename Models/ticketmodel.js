const mongoose=require('mongoose');
const ticketSchema=mongoose.Schema({
moviename:String,
screen:String,
timing:String,
bookedseats:[String]

});

const ticketData=mongoose.model('ticketdtail',ticketSchema);
module.exports=ticketData;
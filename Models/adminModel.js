const mongoose=require('mongoose');
const adminSchema=mongoose.Schema({
    username:String,
    password:String
})
const adminData=mongoose.model('admindetail',adminSchema);
module.exports=adminData;
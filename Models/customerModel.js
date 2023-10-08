const mongoose=require('mongoose');
const customerSchema=mongoose.Schema({
    emailid:String,
    mobile:String,
    username:String,
    password:String,
    address:String
});
const customerData=mongoose.model('customerdetail',customerSchema);
module.exports=customerData;
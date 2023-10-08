const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const customerModel=require('../Models/customerModel')

//...post...customerSignup api
router.post('/customerSignup',async(req,res)=>{
    try{
        const customer=req.body;
        console.log(customer)
        username=req.body.username
        password=req.body.password
        const checkusername= (await customerModel.findOne({username:username})|| await customerModel.findOne({password:password}))
        if(username==="adminadmin"||password ==="admin123"||checkusername){
            res.json({message:"Already exists"})
        }
        else{
        newCustomer=new customerModel(customer);
        console.log(newCustomer)
        const cdata=await newCustomer.save();
        res.json({message:"Registered Successfully"})
        }
    }
    catch(error){
        res.json({message:"unable to add"})
    }
})
module.exports=router;
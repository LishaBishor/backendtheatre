const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const customerModel=require('../Models/customerModel')
const adminmodel=require('../Models/adminModel')

//...post...login api
router.post('/login',async(req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    let customer=await customerModel.findOne({username:username})
    try {
        if(!customer){
            let admin=await adminmodel.findOne({username:username})
            if(!admin){
                res.json({message:"No such User"})
            }
            else{
                if(admin.password==password){
                    jwt.sign({email:username,id:admin._id},"mass",{expiresIn:'1d'},
                    (error,token)=>{
                        if (error) {
                            res.json({message:"Token not generated"})
                        } else {
                            res.json({message:"Admin Login suceesfull",token:token,data:admin})
                        }
                    })

                }
                else{
                    res.status(200).json({message:"Incorrect Password"})
                }
            }
          }else{console.log("customer")
            if(customer.password==password){
                console.log("password")
                jwt.sign({email:username,id:customer._id},"mass",{expiresIn:'1d'},
                (error,token)=>{
                    if (error) {
                        res.json({message:"Token not generated"})
                    } else {
                        res.json({message:"Customer Login successful",token:token,data:customer})
                    }
                })
            }
            else{
                res.status(200).json({message:"Incorrect Password"+customer.password+customer.username})
            }

          }
    } catch (error) {
        res.json({message:"Login failed"})
    }
})
module.exports=router;
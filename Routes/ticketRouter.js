const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const movieModel=require('../Models/movieModel')
const ticketModel=require('../Models/ticketmodel')

//..to update.../updateMoviedetails pushing booked seats.
router.put('/ticketbook/:timing/:screen/:movieId/:token',async(req,res)=>{
    try {
       let timing=req.params.timing;
       let token=req.params.token;
       let screen=req.params.screen;
       let id=req.params.movieId;
       let soldtkts=[]
      let updateddata=[]
       updateddata=req.body.bookedseats
    //    let movie=await movieModel.findOne({_id:id})
    //    let length=+movie.tktsold;
    //    length=length+updateddata.length;
       let movietkt= await ticketModel.find({screen:screen,timing:timing})
       const screenData = movietkt.find(item => item.screen === screen && item.timing === timing);
  if (screenData) {
       console.log(screenData.bookedseats)
       let length=screenData.bookedseats.length
       console.log(length)
       const stkts= await movieModel.findByIdAndUpdate(id,{tktsold:length})
  }
       updateddata.forEach(element=>{
         if (element in movietkt ){
            console.log("already exist")
         }
       })
       console.log()
      
      jwt.verify(token,"mass",(error,decoded)=>{
        if (decoded && decoded.email) {
            //  movieModel.findOne(_id:id)
            updateddata.forEach(element => {
               ticketModel.findOneAndUpdate({screen:screen,timing:timing},
                    {$push:{
                        bookedseats:element
                    }
                }).exec();
            }); 
           
            console.log('Booking confirmed')
          
            res.json({message:"Booking confirmed"})  
        } else {
            res.json({message:"unauthorised user"})
        }
      })
     
       } catch (error) {
        res.json("Unable to Update "+error); 
   }
   
})

//..to cancel tkts.../updateMoviedetails cancel seats.
router.put('/ticketcancel/:timing/:screen/:movieId/:token',async(req,res)=>{
    try {
       let timing=req.params.timing;
       let token=req.params.token;
       let screen=req.params.screen;
       let id=req.params.movieId;
       let notkts=[]
       let cancelled=[]
      let updateddata=[]
      console.log(req.body)
       updateddata=req.body.seatstocancel
    //    let movie=await movieModel.findOne({_id:id})
    //    let length=+movie.tktsold;
    //    length=length+updateddata.length;
       let movietkt= await ticketModel.find({screen:screen,timing:timing})
       const screenData = movietkt.find(item => item.screen === screen && item.timing === timing);
  if (screenData) {
       console.log(screenData.bookedseats)
       let length=screenData.bookedseats.length
       console.log(length)
       const stkts= await movieModel.findByIdAndUpdate(id,{tktsold:length})
  }
      
//    updateddata.forEach(element=>{
//         //  if (element in screenData.bookedseats ){
//         //     console.log("already exist")
//         //  }
//         if (screenData.bookedseats.includes(element)) {
//             console.log(`${element} is in bookedseats.`);
//           } else {
//             notkts.push(element)
//             console.log(`${element} is not in bookedseats.`);
//           }
//        })
      
      
      jwt.verify(token,"mass",(error,decoded)=>{
        if (decoded && decoded.email) {
            //  movieModel.findOne(_id:id)
            updateddata.forEach(element => {
                if (screenData.bookedseats.includes(element)) {
                ticketModel.findOneAndUpdate({screen:screen,timing:timing},
                     {$pull:{
                         bookedseats:element
                     }
                 }).exec();
                  cancelled.push(element)
                }
                else {
                    console.log(`${element} is not in bookedseats.`);
                    notkts.push(element)
                    
                  //  res.json({message: element+"is not in bookedseats"})
                  }
             }); 
             console.log(notkts)
             console.log(cancelled)
             if(notkts.length==0){
                res.json({message:"tickets cacelled "+cancelled})
             }
             else if(cancelled.length==0){
                res.json({message:notkts+" are not yet booked to cancel"})
             }
             else{
                res.json({message:"tickets cacelled "+cancelled+".  "+ notkts+" are not yet booked to cancel"})
             }
            console.log('tickets cancelled')
          
           // res.json({message:"tickets cacelled"})  
        } else {
            res.json({message:"unauthorised user"})
        }
      })
     
       } catch (error) {
        res.json("Unable to Update "+error); 
   }
   
})


//...get.../booked seat details
router.get('/bookedseats/:timing/:screen/:token', async(req,res)=>{
    let timing=req.params.timing;
       let token=req.params.token;
       let screen=req.params.screen;
       console.log(screen,timing)
    const data= await ticketModel.findOne({screen:screen,timing:timing});
    console.log(data)
    console.log(token)
   
    try{
        // jwt.verify(token,"mass",(error,decoded)=>{
        //     if (decoded && decoded.email) {
              
                res.json(data)
        //     }
        //     else{
        //         res.json({message:"Unauthorised user"},decoded,decoded.email)
        //     }
        // })
       
    }catch(error){
        res.status(400).json("cannot get, Error:"+ error);
    }
})

module.exports=router;

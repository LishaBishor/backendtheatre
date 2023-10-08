const express=require('express');
const jwt=require('jsonwebtoken');
const router=express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));
const movieModel=require('../Models/movieModel')
const ticketModel=require('../Models/ticketmodel');
const { forEach } = require('mongoose/lib/helpers/specialProperties');

//...post...addmovie  api
router.post("/addmovie", async (req, res) => {
    try {
        console.log("hello")
        const movie = req.body;
       let screen=req.body.screen;
       let moviename=req.body.moviename
        let ticket={screen:screen,moviename:moviename}
        
        jwt.verify(req.body.token,"mass",(error,decoded)=>{
            if (decoded && decoded.email) {
                movieModel(movie).save();
                ticketModel(ticket).save();
                
        res.json({message:"Movie details added sucessfully!!"})  
            } else {
                res.status(200).json({ message: "unauthorised user" })
            }
        })
        
    } catch (err) {
        console.log(err)
        res.status(404).json({ message: `Cannot add movie details `, error:err  });
    }
});

//api for getting all the moviedetails
router.get("/viewmovies/:token", async (req, res) => {
    const data = await movieModel.find({}, {responses:0});
    
    try {
        jwt.verify(req.params.token,"mass",(error,decoded)=>{
            if(decoded && decoded.email){

                res.json(data)
            }
            else{
                res.status(400).json({message:"Unauthorised user"},decoded,decoded.email)
            }
        })
        
    } catch (err) {
        res.status(404).json({ mesaage: `Cannot get Jobs ${err}` });
    }
});

//api for finding one particular Movie's Details
router.get('/findthemovie/:id',async(req,res)=>{
    let id=req.params.id
    let movie=await movieModel.findOne({_id:id})
    try{
    if(movie){
        res.json(movie)
   
    }
    else{
        res.status(400).json({message:"No details availablr for that movie"}) 
    }
}catch(error){
    res.status(400).json({message:"some error occured",error})
    console.log(error) }
   
});

//..to update.../update reviews.(to store customers reviews)
router.put('/upreview/:id/:rating/:token',async(req,res)=>{
    try {
       let id=req.params.id;
       let token=req.params.token;
       let rating=+req.params.rating;
      let updateddata=req.body.userfeedback
      let movie=await movieModel.findOne({_id:id})
      let feedback=movie.userfeedback;
      let sum=0;
      let avgRating=0;
      
      let length=feedback.length+1;
      let totalRating=0
      if(length!=0){
      feedback.forEach(element=>{
        totalRating=totalRating+element.rating;
        
      })
      console.log("length"+length)
      console.log("totalrating"+totalRating)
       sum=totalRating+rating;
       console.log("sum",sum)
       avgRating=sum/length
    }
    console.log("avg"+avgRating)
      jwt.verify(token,"mass",(error,decoded)=>{
        if (decoded && decoded.email) {
                        //  movieModel.findOne(_id:id)
            const feedback=movieModel.findByIdAndUpdate(id,{
                $push:{
                   userfeedback:updateddata 
                    },
                   avgrating:avgRating
            }).exec();
            console.log('updated')
            res.json({message:"updated"})  
        } else {
            res.json({message:"unauthorised user"})
        }
      })
     
       } catch (error) {
        res.json("Unable to Update "+error); 
   }
});

//delete...to delete a movie
router.delete('/deletemovie/:id/:token',async(req,res)=>{
    
    try{
        let id=req.params.id;
        let token=req.params.token;
        const deleteddata=req.body;
        let movie=await movieModel.findOne({_id:id})
        
        console.log(movie)
        console.log(movie.moviename)
        let deltkt=[]
        // ticketModel.find({moviename:movie.moviename})
        if(id!='650ba918624c437d95359d83')       
       {
       
        jwt.verify(token,"mass",(error,decoded)=>{
            if (decoded && decoded.email) {
                console.log(deleteddata)
           let deldata= movieModel.findByIdAndDelete(id).exec();
        //   deltkt=ticketModel.find({moviename:movie.moviename})
        //   deltkt.forEach(element=>{element.delete})
          let tktdet=ticketModel.findOneAndDelete({moviename:movie.moviename}).exec();
          
           
         
        res.json({message:'deleted movie details sucessfully'})
            } else {
                res.json({message:"Unauthorised user",token})
            }
        })
    }
    else{res.json({message:"This movie is running Cannot be detelted"}) }
        
    }catch(error){
        res.json({message:"cannot deleted "+error})
    }
});

//..to update.../update Movie Details.
router.put('/updatemovie/:id/:token',(req,res)=>{
    try {
       let id=req.params.id;
       let token=req.params.token;
      updateddata=req.body
      jwt.verify(token,"mass",(error,decoded)=>{
        if (decoded && decoded.email) {
             movieModel.findByIdAndUpdate(id,updateddata).exec()
            console.log('updated')
            res.json({message:"updated"})  
        } else {
            res.json({message:"unauthorised user"})
        }
      })
     
       } catch (error) {
        res.json("Unable to Update "+error); 
   }
})



module.exports=router;
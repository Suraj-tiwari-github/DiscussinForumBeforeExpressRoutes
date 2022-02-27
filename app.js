const express=require('express');
const path = require("path");
const app=express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const {discussionSchema,replySchema}=require('./schemas.js');



mongoose.connect('mongodb://localhost:27017/discussionPage')
.then(()=>{
    console.log("Mongo Connection Open");
})
.catch((err=>{
    console.log("Mongo Error");
    console.log(err);
}))

//* Our model
const Discussion=require('./models/discussion');
const Reply=require('./models/reply');



const {disuccsionSchema}=require('./schemas');
const catchAsync=require('./utils/catchAsync');
const ExpressError=require('./utils/ExpressError');
//! for HTTP verbs.
const methodOverride=require('method-override');
const reply = require('./models/reply.js');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({extended: true}));

app.use(methodOverride('_method'));

//* our middleware for the models schema
const validateDiscussion=(req,res,next)=>{
    const {error}=discussionSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400);
    }
    else{
        next();
    }
}

const validateReply=(req,res,next)=>{
    const {error}=replySchema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
}
//!RESTFUL routes.
app.get('/',(req,res)=>{
    res.render('home')
})


app.get('/discussionPage',catchAsync(async (req,res)=>{
    //* finding all the list and sending it discussionPage.
    const discussion=await Discussion.find({});
    res.render('pages/discussionPage',{discussion});
}));

app.get('/discussionList',catchAsync(async (req,res)=>{
   const discussion= await Discussion.find({});
//    res.send(discussion) 
   res.render('pages/discussionList',{discussion})
}));

//! new Route.
app.get("/discussion/new", (req, res) => {
  res.render("pages/new");
});

app.post('/discussionPage', validateDiscussion, catchAsync(async(req,res,next)=>{
    const discussion=new Discussion(req.body.discussion);
    await discussion.save();
    res.redirect(`/discussionList/${discussion._id}`);
}));

//! show route.
app.get('/discussionList/:id', catchAsync(async(req,res)=>{
    const discussion=await Discussion.findById(req.params.id).populate('replies'); 
    console.log(discussion);
    // res.send(discussion);
    res.render('pages/show', {discussion});
}));

//! edit route.
app.get('/discussionList/:id/edit', catchAsync(async(req,res)=>{
    const discussion=await Discussion.findById(req.params.id);
    res.render('pages/edit',{discussion});
}));

app.put('/discussionList/:id', catchAsync(async(req,res)=>{
    const {id}=req.params;
    const discussion=await Discussion.findByIdAndUpdate(id,{...req.body.discussion});
    res.redirect(`/discussionList/${discussion._id}`)
}));

//! delete route.
app.delete('/discussionList/:id', catchAsync(async(req,res)=>{
    const{id}=req.params;
    await Discussion.findByIdAndDelete(id);
    res.redirect('/discussionPage');
}));


// ***********
//!reply route for discussion:id/reply.
// *********

app.post('/discussionList/:id/reply', validateReply, catchAsync(async(req,res)=>{
    const discussion=await Discussion.findById(req.params.id);
    const reply=new Reply(req.body.reply);
    discussion.replies.push(reply);
    await reply.save();
    await discussion.save();
    res.redirect(`/discussionList/${discussion._id}`);
    // res.send("You Made it");
}))

//! To delete a reply.
app.delete('/discussionList/:id/replies/:replyId', catchAsync(async(req,res)=>{
    const {id,replyId}=req.params;
    //! $pull is a operator which pulls only the record which matches with the condition.
    await Discussion.findByIdAndUpdate(id, {$pull:{replies:replyId}})
    await Reply.findByIdAndDelete(replyId);
    res.redirect(`/discussionList/${id}`)
    // res.send("You delete it.");
}))


app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not Found',404))
})



//* our error handler.
app.use((err,req,res,next)=>{
 const {statusCode=500}=err;
 if(!err.message) err.message='Oh No, Something went Wrong!!'
 res.status(statusCode).render('error',{err})
})
app.listen(3000, ()=>{
    console.log('Serving on Port 3000')
})
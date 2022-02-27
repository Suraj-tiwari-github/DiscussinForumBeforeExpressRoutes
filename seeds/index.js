//* seeding some data in our mongo, to over with.

const mongoose = require("mongoose");

const {titles,descriptors}=require('./seedHelpers');
const Discussion = require("../models/discussion");

mongoose
  .connect("mongodb://localhost:27017/discussionPage")
  .then(() => {
    console.log("Mongo Connection made with for seeding it");
  })
  .catch((err) => {
    console.log("Mongo Connection error on seeds");
  });


const sample=array=>array[Math.floor(Math.random()*array.length)];


const seedDB = async () => {
  await Discussion.deleteMany({});
  for(let i=0; i<25; i++){
  const c = new Discussion({
     title:sample(titles),
     description:sample(descriptors)
  });
  await c.save();
}
};

//* execute it.
seedDB().then(()=>{
    mongoose.connection.close();
})



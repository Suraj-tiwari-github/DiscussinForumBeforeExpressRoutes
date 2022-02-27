const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const replySchema = new Schema({
  
  body: { type: String }
});

module.exports=mongoose.model("Reply", replySchema);

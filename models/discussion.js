const mongoose=require('mongoose');
const Reply=require('./reply');

const Schema=mongoose.Schema;

const discussionSchema=new Schema({
    name:String,
    title:String,
    description:String,
    replies:[
        {
            type:Schema.Types.ObjectId,
            ref:'Reply'
        }
    ]
})

//!post middleware to delete every reply associated with it.
discussionSchema.post('findOneAndDelete', async function(del){
    // Just deleted document, can be taken inside of the async function which will contain an array of replies, we can dereference it to delete the replies too.
    if(del){
        await Reply.deleteMany({
            _id:{
                $in: del.replies
                //! This query means it will delete those id, which contains in our document that was just deleted in its replies array.
            }
        })
    }
    console.log("Deleted.")
})

module.exports=mongoose.model('Discussion',discussionSchema);
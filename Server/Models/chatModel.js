import mongoose from "mongoose"

const chatSchema = mongoose.Schema(
{
    members: {
        type:Array,
    }
},
{
    timestamps : true
});

var chatModel = mongoose.model('Chat', chatSchema);

export default chatModel
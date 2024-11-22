import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }, 
    profilePic: {
      type: String,
      default: "",
    },
    coverPicture: String,
    about: String,
    livein : String,
    relationship : String,
},
{timestamps : true}
)

const UserModel = mongoose.model('User', userSchema);
export default UserModel
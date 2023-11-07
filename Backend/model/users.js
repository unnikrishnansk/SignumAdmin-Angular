
import mongoose from 'mongoose';

// Model for the App
const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    }
    
})

const usercollection= new mongoose.model("SignupDatas",userschema);

export default usercollection;
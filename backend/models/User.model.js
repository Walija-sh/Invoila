import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs'
const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'A user must have username'],
        trim: true
    },
    email:{
        type:String,
        required:[true,'A user must have email'],
        validate:{
            validator:function(value){
                return validator.isEmail(value);
            },
            message:'Please provide a valid email address'
        },
         unique: true,
     lowercase: true
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength: 8,
  select: false
    },
    role:{
        type:String,
        default:'user'
    },
        currency: { type: String, default: "usd" },
    profilePhoto:{
    url:{
        type:String,
        default:''
    },
    public_id:{
        type:String,
        default:''
    }
}
},{timestamps:true})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// instance method
UserSchema.methods.comparePassword=async function(candidatePassword) {

    return  await bcrypt.compare(candidatePassword,this.password);
    
}
const User= mongoose.models.User || mongoose.model('User',UserSchema);

export default User;
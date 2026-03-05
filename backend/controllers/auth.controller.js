import User from '../models/User.model.js'
import generateToken from '../utils/generateToken.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/appError.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../config/cloudinary.js'

const registerUser = catchAsync(async (req,res,next)=>{

const {username,email,password} = req.body

if(!username || !email || !password){
    return next(new AppError('Please provide all fields',400))
}

const existingUser = await User.findOne({ email });

if(existingUser){
    return next(new AppError('User already exists',409))
}

let profilePhoto={}

if(req.file){
    profilePhoto={
        url:req.file.path,
        public_id:req.file.filename
    }
}


const user = await User.create({
    username,
    email,
    password,
    profilePhoto
})



const token = generateToken(user._id)

res.status(201).json({
    status:'success',
    message:'Registered user successfully',
    data:{
        id:user._id,
        username:user.username,
        email:user.email,
        profilePhoto:user.profilePhoto?.url,
        token
    }
})

})

const loginUser = catchAsync(async (req,res,next)=>{

const {email,password} = req.body

if(!email || !password){
    return next(new AppError('Please provide all fields',400))
}

const user = await User.findOne({email}).select('+password')

if(!user){
    return next(new AppError('User does not exist',404))
}

const validPassword = await user.comparePassword(password.trim())

if(!validPassword){
    return next(new AppError('Invalid credentials',401))
}

const token = generateToken(user._id)

res.status(200).json({
    status:'success',
    message:'Login user successfully',
    data:{
        id:user._id,
        username:user.username,
        email:user.email,
        profilePhoto:user.profilePhoto?.url,
        token
    }
})

})

const getMe = (req,res)=>{

const user = req.user

res.status(200).json({
    status:'success',
    message:'Current user fetched successfully',
    data:{
        id:user._id,
        username:user.username,
        email:user.email,
        profilePhoto:user.profilePhoto?.url
    }
})

}

// Update user profile
// ------------------ Update Password ------------------
const updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!oldPassword || !newPassword)
    return next(new AppError('Old and new password required', 400));

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new AppError('Old password incorrect', 401));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
  });
});

// ------------------ Update Profile Photo ------------------
const updateProfilePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No file uploaded', 400));

  const user = await User.findById(req.user._id);

  // Delete old photo
  if (user.profilePhoto?.public_id) {
    await cloudinary.uploader.destroy(user.profilePhoto.public_id);
  }

  // Save new photo
  user.profilePhoto = {
    url: req.file.path,
    public_id: req.file.filename,
  };

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Profile photo updated successfully',
    data: { profilePhoto: user.profilePhoto.url },
  });
});

export {registerUser,loginUser,getMe,updatePassword,updateProfilePhoto}
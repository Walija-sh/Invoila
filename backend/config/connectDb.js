import mongoose from "mongoose";

const connectDb = async ()=>{
    // events attached to connection
    mongoose.connection.on('connected',()=>{
        console.log('Db connected Successfully');
        
    })
    mongoose.connection.on('error',(err)=>{
        console.error('Error connecting Db',err);
        process.exit(1)
        
    })
await mongoose.connect(process.env.MONGO_URI)
}

export default connectDb;


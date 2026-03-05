import app from './app.js'


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`server started successfully at http://localhost:${PORT}`);
    
})
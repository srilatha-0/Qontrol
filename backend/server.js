const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User schema
const userSchema = new mongoose.Schema({
  username: String,required:true,unique:true,
  phone: Number,required:true,
  email: String,unique:true,required:true,
  password: String,required:true,
});

const User = mongoose.model("User", userSchema);

// Routes
app.post("/signup", async (req, res) => {
  const { username, phone, email, password } = req.body;
  try {
    const newUser = new User({ username, phone, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    res.status(200).json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//admin schema____________________________________________________________
//____________________________________________________________________________
const adminschema = new mongoose.Schema({
  username:{
    type:String,require:true,unique:true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const Admin = mongoose.model("Admin",adminschema);


app.post("/admin/signup",async(req,res) => {
  const{username,phone,emmail,password,adminCode}=req.body;
  if(adminCode !== process.env,ADMIN_CODE){
    return res.status(403).json({message:"Invalid admin code"});
  }
  try{
    const existingAdmin = await Admin.findOne({username});
    if(existingAdmin){
      return res.status(400).json({messgae:"Admin already exists"});
    }
    const newAdmin = new Admin({
      username,
      phone,
      email,
      password,
    });
    await newAdmin.save();
    res.status(201).json({message:"admin registered successfully"});
  }
  catch(err){
    res.status(500).json({error:err.message});
  }
});

app.post("/admin/login",async(req,res) =>{
  const{username,passwrod,adminCode} = req.body;

  if (adminCode !== process.env.ADMIN_CODE) {
    return res.status(403).json({ message: "Invalid admin code" });
  }
  try{
    const admin = await Admin.findOne({username,password});
    if(!admin){
      return res.status(400).json({message:"invalid credentials"});
    }
    res.status(200).json({message:"Admin login successful"});
  }
  catch(err){
    res.status.json({error:err.message});
  }

})

//_______________________________________________________________________
//_______________________________________________________________________

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

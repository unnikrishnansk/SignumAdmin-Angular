
// Import files and packages
import express, { response } from 'express';
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
import usercollection from './model/users.js';
import cors from 'cors'

// starting the app
const app = express();

// assigning port
const PORT = 5000;

//connecting to the mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/AngularNgrxApp")
.then(()=>console.log("MongoDB connected..."))
.catch(()=>console.log("MongoDB failed to conenct"));

// providing cors options for cross origin resource sharing
const corsOptions = {
    origin: 'http://localhost:4200', // frontend running port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
  };
  
app.use(cors(corsOptions));

app.use(express.json());

app.post('/signup',async (req,res)=>{
    try{
        const datas = {
            username:req.body.username,
            password : req.body.password,
            email:req.body.email
        };
        const check = await usercollection.findOne({username:datas.username});
         if(check){
            res.json({
                message:"Username is taken",
                exist:true
            });
        }else{
            await usercollection.insertMany([datas]);
            res.json({
                message:"success" 
            });
        }
    }
    catch(err){
        console.log("signup error >>>",err);
    }
})
app.post('/login',async (req,res)=>{
    try{
        const logindatas = {
            username : req.body.username,
            password : req.body.password
        };
        const check = await usercollection.findOne({username:logindatas.username});
        const allUsers = await usercollection.find();
        if(check){
            if(check.password === logindatas.password && check.role === "admin"){
                const token = jwt.sign({
                    id:check._id, role:check.role
                },
                'secret_key',
                {
                    expiresIn:"2h"
                });
                // console.log("token",token);
                res.json({
                    message:"Admin",
                    token : token,
                    role:"admin",
                    adminname : logindatas.username,
                    users : allUsers
                }); 
            }else if(check.password === logindatas.password){
                const token = jwt.sign({ 
                    id:check._id, 
                    role:check.role 
                }, 
                'secret_key',
                {
                    expiresIn:"2h"
                });
                // console.log(token);
                res.json({
                    message : "User",
                    token : token,
                    role : "user",
                    user : check
                });
            }else{
                res.json({errmessage:"Password Incorrect",});
            }
        }else{
            res.json({errmessage:"Username Incorrect"});
        }
    }
    catch(err){
        console.log("login",err);
    } 
})

app.get('/users',async(req,res)=>{
    try{
        const usersdata = await usercollection.find({});
        // console.log(usersdata);
        if(usersdata){
            res.send({
                userdata:usersdata
            })
        }
    }
    catch(err){
        console.log("gettng data >>>",err);
    }
})

app.get('/edit',async(req,res)=>{
    try{
        const username = req.query.user;
        const selectedrole = req.query.role;
        await usercollection.updateOne({username:username},{$set:{role:selectedrole}})
        const user = await usercollection.find({});
        res.json({
            user
        });
    }
    catch(err){
        console.log("edit data  >>>",err);
    }
})

app.get('/delete',async(req,res)=>{
    try{
        const username = req.query.user;
        await usercollection.findOneAndDelete({username:username});
        const users = await usercollection.find();
        res.json({
            users 
        });
    }
    catch(err){
        console.log("delete data  >>>",err);
    }
})

app.listen(PORT, ()=>{
    console.log(`Connected to the ${PORT}`)
})
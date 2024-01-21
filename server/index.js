const express = require("express");
const mongoose  = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const Place = require("./models/place");
const Booking = require("./models/booking");
const jwt = require("jsonwebtoken");
const cookiParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwetSecret = "ryoikitwnkai@inifintyvoid";

mongoose.connect("mongodb://127.0.0.1:27017/bookingApp").then((e)=>console.log("MongoDB Connected"));

function getUserDataFromReq(req) {
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token,jwetSecret,{},async(error,userdata)=>{
            if(error) throw error;
            resolve(userdata);
        });
    });
}

app.use(express.json());
app.use(cookiParser());
app.use("/uploads",express.static(__dirname+"/uploads"));
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173',
}));

app.get("/",(req,res)=>{
    res.json("Hello Prince");
});

app.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user){
        const passOk = bcrypt.compareSync(password,user.password);
        if(passOk){
            jwt.sign({
                email:user.email,
                id:user._id,
            },jwetSecret,{},(error,token)=>{
                if(error) throw error;
                res.cookie('token',token).json(user);
            });
        }
        else{
            res.status(422).json("not ok");
        }
    }
    else{
        res.json("not found");
    }
});

app.post("/register",async(req,res)=>{
    const {name,email,password} = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password:bcrypt.hashSync(password,bcryptSalt),
        });
        res.json(user);
    } catch (error) {
        res.status(400).json(error);
    }
});

app.get("/profile",(req,res)=>{
    const  {token} = req.cookies;
    if(token){
        jwt.verify(token,jwetSecret,{},async(error,user)=>{
            if(error) throw error;
            const {name,email,_id} = await User.findById(user.id);
            res.json({name,email,_id});
        });
    }
    else{
        res.json(null);
    }
});

app.post("/logout",(req,res)=>{
    res.cookie("token","").json(true);
});

app.post("/upload-by-link",async (req,res)=>{
    const {link} = req.body;
    const newName = "photo" + Date.now() +".jpg" ;
    await imageDownloader.image({
        url:link,
        dest:__dirname + "/uploads/" + newName,
    });
    res.json(newName);
});

const photosmiddleware = multer({dest:"uploads/"});
app.post("/upload",photosmiddleware.array("photos",100),(req,res)=>{
    const uploadFiles = [];
    for (let i=0;i<req.files.length;i++){
        const {path,originalname} = req.files[i];
        const parts = originalname.split(".");
        const ext = parts[parts.length-1];
        const newPath = path+"."+ext;
        fs.renameSync(path,newPath);
        uploadFiles.push(newPath.replace("uploads/",""));
    }
    res.json(uploadFiles);
});

app.post("/places",(req,res)=>{
    const {token} = req.cookies;
    const {title,address,
        addedPhotos,description,perks,extraInfo
        ,checkIn,checkOut,maxGuests,price} = req.body;
    jwt.verify(token,jwetSecret,{},async(error,user)=>{
        if(error) throw error;
        const placeData =  await Place.create({
            owner : user.id,
            title,address,photos:addedPhotos,
            description,perks,extraInfo
            ,checkIn,checkOut,maxGuests,price,
        });
        res.json(placeData);
    });
});

app.get("/user-places",(req,res)=>{
    const {token} = req.cookies;
    jwt.verify(token,jwetSecret,{},async(error,user)=>{
        if(error) throw error;
        const {id} = user;
        res.json(await Place.find({owner:id}));
    });
});

app.get("/places/:id",async(req,res)=>{
    const {id} = req.params;
    res.json(await Place.findById(id));
});

app.put("/places",async (req,res)=>{
    const {token} = req.cookies;
    const {id,title,address,
        addedPhotos,desctiption,perks,extraInfo
        ,checkIn,checkOut,maxGuests,price,} = req.body;
    jwt.verify(token,jwetSecret,{},async(error,userdata)=>{
        if (error) throw error;
        const placedata = await Place.findById(id);
        if(userdata.id === placedata.owner.toString()){
            placedata.set({
            title,address,photos:addedPhotos,
            desctiption,perks,extraInfo
            ,checkIn,checkOut,maxGuests,price,
            });
            await placedata.save();
            res.json("ok");
        }
    });
});

app.get("/places",async (req,res)=>{
    res.json(await Place.find({}));
});

app.post("/bookings",async(req,res)=>{
    const userData = await getUserDataFromReq(req);
    const {
        place,checkIn,checkOut,
        numberOfGuests,name,phone,price
    }
    = req.body;
    Booking.create({
        place,checkIn,checkOut,numberOfGuests,name,phone,price,
        user:userData.id,
    }).then((doc)=>{
        res.json(doc);
    }).catch((error)=>{
        throw error;
    });
});

app.get("/bookings",async (req,res)=>{
 const userData = await getUserDataFromReq(req);
 res.json(await Booking.find({user:userData.id}).populate("place"));
});

app.listen(4000);
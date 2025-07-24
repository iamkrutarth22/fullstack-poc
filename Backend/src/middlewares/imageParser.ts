// import express, {Request,Response} from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';


const fileStorage= multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log("file url",file)
        cb(null,"images");
    },
    filename:(req,file,cb)=>{
        
        console.log("file url 2",file)
        cb(null,uuidv4()+file.originalname);
    }
})

const multerConfig=multer({storage:fileStorage})

export default multerConfig
import express, {Request,Response} from 'express';
import path from 'path';
import userRoute from './routes/user.routes'
import authRoute from './routes/auth.routes'
import blogsRoute from './routes/blogs.routes'
import cors from 'cors';
import { fileURLToPath } from 'url';
import cloudinaryMiddleware from 'middlewares/cloudinaryMiddleware';

const app = express();



const port = 8080;


app.use(cors({
  origin: '*', // Or specify frontend origin like 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json()); 
app.use(cloudinaryMiddleware.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'imageUrls', maxCount: 1 }
]));
// app.use(multerConfig.single('profilePicture'))
app.use('/images', express.static(path.join(__dirname, 'images')));




app.use('/api',userRoute)
app.use('/api',authRoute)
app.use('/api',blogsRoute)

app.listen(port, () => {
  console.log(`[server]: Server running at http://localhost:${port}`);
});



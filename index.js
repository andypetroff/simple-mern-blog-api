import express from 'express';

import { env } from './config.js';

import fs from 'fs';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
//import { CloudinaryStorage } from 'multer-storage-cloudinary';

import cors from 'cors';
import mongoose from 'mongoose';

import { loginValidation, postCreateValidation, registerValidation } from './validations.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
.connect(env.mongodb)
.then(() => console.log('DB OK'))
.catch((err) => console.log('DB ERROR', err));

const app = express();

// fn (req, file, cb) {}
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync(env.upload_folder_name)) {
            fs.mkdirSync(env.upload_folder_name);
        }
        cb(null, env.upload_folder_name);
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

cloudinary.config({
    cloud_name: env.cloudinary_cloud_name, 
    api_key: env.cloudinary_api_key, 
    api_secret: env.cloudinary_api_secret, 
    secure: true,
});

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//       folder: env.upload_folder_name,
//       unique_filename: false,
//     },
// });

const upload = multer({ 
    storage: storage,
    //fileFilter,
});

app.use(express.json());
app.use(cors());
app.use('/' + env.upload_folder_name, express.static(env.upload_folder_name));

app.get('/', (req, res) => { res.send(env.app_name) });

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(
            req.file.path, 
            {
              use_filename: true,
              folder: env.upload_folder_name,
              unique_filename: false,
              overwrite: true,
            }
        );

        fs.unlinkSync(req.file.path);

        res.json({ 
            url: result.secure_url,
        });
    } catch (e) {
        console.error(e);
        res.status(403).json({
            message: 'Failed to upload the file!',
        });
    }

    // res.json({ 
    //     url: req.file.path, 
    // });
});

app.get('/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(env.port, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log(`Server OK (Port: ${env.port})`);
});

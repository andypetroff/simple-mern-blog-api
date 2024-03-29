import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = JWT.sign({
            _id: user._id,
        }, 
        'secret_code', 
        {
            expiresIn: '30d',
        });

        const {
            _id,
            fullName
        } = user._doc;

        res.json({
            _id,
            fullName, 
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register'
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ 
                message: 'No user was found',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({ 
                message: 'Invalid login or password',
            });
        }

        const token = JWT.sign({
            _id: user._id,
        }, 
        'secret_code', 
        {
            expiresIn: '30d',
        });

        const {
            _id,
            fullName
        } = user._doc;

        res.json({
            _id,
            fullName, 
            token,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to log in',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: 'No user was found'
            });
        }

        const {
            _id,
            fullName
        } = user._doc;

        res.json({
            _id,
            fullName, 
        });

        // const { 
        //     passwordHash, 
        //     email, 
        //     ...userData 
        // } = user._doc;
        // 
        // res.json(userData);

    } catch (err) {
        res.status(500).json({
            message: 'No access'
        });
    }
};

import { body } from 'express-validator';

export const loginValidation = [
    body(
        'email', 
        'Invalid email'
    ).isEmail(),
    body(
        'password',
        'Password must have at least 5 symbols'
    ).isLength({ 
        min: 5 
    }),
];

export const registerValidation = [
    body(
        'email', 
        'Invalid email'
    ).isEmail(),
    body(
        'password',
        'Password must have at least 5 symbols'
    ).isLength({ 
        min: 5 
    }),
    body(
        'fullName',
        'Please enter a correct name'
    ).isLength({ 
        min: 2 
    }),
    body(
        'avatarUrl',
        'Invalid avatar link'
    ).optional().isURL(),
];

export const postCreateValidation = [
    body(
        'title', 
        'Enter article title'
    ).isLength({ 
        min: 3
    }).isString(),
    body(
        'text',
        'Enter article text'
    ).isLength({ 
        min: 5
    }).isString(),
    body(
        'tags',
        'Invalid tag'
    ).optional().isString(),
    body(
        'imageUrl',
        'Invalid image link'
    ).optional().isString(),
];

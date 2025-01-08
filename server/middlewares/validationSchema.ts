const { body } = require('express-validator')
import { Request, Response, NextFunction } from 'express'
export const createPostValidation = () => {
    return [
        body('title')
            .isString()
            .withMessage('title should be string')
            .notEmpty()
            .withMessage('title is required')
            .isLength({ min: 2 })
            .withMessage('title is medry show'),
        body('userId')
            .isString()
            .withMessage('userId should be string')
            .notEmpty()
            .withMessage('userId is required'),
        body('url')
            .isURL()
            .withMessage('url should be Url formate ')
            .notEmpty()
            .withMessage('url is required')
    ];

}

export const addorremovelikeValidation = () => {
    return [

        body('postId')
            .isString()
            .withMessage('postId should be string')
            .notEmpty()
            .withMessage('postId is required'),
        body('userId')
            .isString()
            .withMessage('userId should be string')
            .notEmpty()
            .withMessage('userId is required')
    ];
}


export const addcommentValidation = () => {
    return [
        body('comment')
            .isString()
            .withMessage('title should be string')
            .notEmpty()
            .withMessage('title is required')
            .isLength({ min: 2 })
            .withMessage('title is medry show'),
        body('postId')
            .isString()
            .withMessage('postId should be string')
            .notEmpty()
            .withMessage('postId is required'),
        body('userId')
            .isString()
            .withMessage('userId should be string')
            .notEmpty()
            .withMessage('userId is required')
    ];
}

export const registerValidation = () => {
    return [
        body('email')
            .isEmail()
            .withMessage('email should be vaild email')
            .notEmpty()
            .withMessage('email is required'),
        body('firstName')
            .isString()
            .withMessage('firstName should be string')
            .notEmpty()
            .withMessage('firstName is required'),
        body('lastName')
            .isString()
            .withMessage('lastName should be string')
            .notEmpty()
            .withMessage('lastName is required'),
        body('userName')
            .isString()
            .withMessage('userName should be string')
            .notEmpty()
            .withMessage('userName is required'),
        body('password')
            .isString()
            .withMessage('password should be string')
            .notEmpty()
            .withMessage('password is required')
    ];
}


export const loginValidation = () => {
    return [
        body('userName')
            .isString()
            .withMessage('userName should be string')
            .notEmpty()
            .withMessage('userName is required'),
        body('password')
            .isString()
            .withMessage('password should be string')
            .notEmpty()
            .withMessage('password is required')
    ];
}









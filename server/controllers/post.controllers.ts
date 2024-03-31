import { RequestHandler } from 'express'
import { DataStore, initDb } from '../dataStore';
import { Comment, Like, Post } from '../types';
import crypto from 'crypto'
const { validationResult } = require('express-validator')
import { AppError } from '../utils/appError'
import { FAIL, SUCCESS } from '../utils/httpstatusText';

type createPostType = Pick<Post, 'title' | 'url' | 'userId'>;

//   complete send method 

export class PostController {

    private db: DataStore;
    private static postController: any = null;

    constructor(db: DataStore) {
        this.db = db;
    }

    public static getPostController(db: DataStore) {
        if (this.postController == null) {
            this.postController = new PostController(db);
        }
        return this.postController;
    }




    public listPosts: RequestHandler<{}, {}, {}, {}> = async (req, res) => {
        const posts = await this.db.listPosts();
        res.status(200).json({
            status: SUCCESS,
            data: {
                posts: posts
            }
        });
    }


    public getPost: RequestHandler<{ id: string }, {}, {}, {}> = async (req, res) => {
        const post = await this.db.getPost(req.params.id);
        res.status(200).json({
            status: SUCCESS,
            data: {
                post: post
            }
        });
    }

    public createPost: RequestHandler<{}, {}, { title: string, url: string, userId: string, img: string }, {}> = async (req, res, next) => {

        const post: Post = {
            id: crypto.randomUUID(),
            url: req.body.url,
            postedAt: Date.now(),
            userId: req.body.userId,
            title: req.body.title,
            img: req.body.img
        }
        await this.db.createPost(post);

        res.status(202).json({
            status: SUCCESS,
            data: {
                post: "ok"
            }
        });
    }


    public deletePost: RequestHandler<{ id: string }, {}, {}, {}> = async (req, res) => {
        await this.db.deletePost(req.params.id);
        res.status(200).json({
            status: SUCCESS,
            data: {
                posts: "ok"
            }
        });
    }


    public AddOrRemoveLike: RequestHandler<{}, {}, { userId: string, postId: string }, {}> = async (req, res) => {

        const like = await this.db.userPostLike(req.body.postId, req.body.userId);
        if (like) {
            await this.db.deleteLike(req.body.userId, req.body.postId);
        }
        else {
            const like: Like = {
                userId: req.body.userId,
                postId: req.body.postId
            }
            await this.db.createLike(like);
        }
        res.status(200).json({
            status: SUCCESS,
            data: {
                posts: "ok"
            }
        });
    }

    public getListLike: RequestHandler<{ postId: string }, {}, {}, {}> = async (req, res) => {
        const listLike: Like[] = await this.db.listLike(req.params.postId);
        res.status(200).json({
            status: SUCCESS,
            data: {
                Like: listLike
            }
        });
    }


    public addcomment: RequestHandler<{}, {}, { comment: string, postId: string, userId: string }, {}> = async (req, res) => {
        const comment: Comment = {
            id: crypto.randomUUID(),
            comment: req.body.comment,
            userId: req.body.userId,
            postedAt: Date.now(),
            postId: req.body.postId
        }
        await this.db.createComment(comment);
        res.status(200).json({
            status: SUCCESS,
            data: {
                comment: "ok"
            }
        });
    }
    public listComment: RequestHandler<{ postId: string }, {}, {}, {}> = async (req, res) => {
        const comments: Comment[] = await this.db.listComment(req.params.postId)
        res.status(200).json({
            status: SUCCESS,
            data: {
                comments: comments
            }
        });

    }
    public removeComment: RequestHandler<{ commentId: string }, {}, {}, {}> = async (req, res) => {
        await this.db.deleteComment(req.params.commentId);
        res.status(200).json({
            status: SUCCESS,
            data: {
                comment: "ok"
            }
        });
    }

}












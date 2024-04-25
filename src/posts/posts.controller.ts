import express, { NextFunction, request } from "express";
import Post from "./post.interface";
import Controller from "interfaces/controller.interface";
import PostNotFoundExecption from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middlewares/validation.middleware";
import CreatePostDto from "./posts.dto";

class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();

  private posts: Post[] = [
    {
      id: 1,
      author: "Marcin",
      content: "Dolor sit amet",
      title: "Lorem Ipsum",
    },
    // {
    //   id: 2,
    //   author: "legrand",
    //   content: "Dolor sit amet",
    //   title: "Lorem Ipsum",
    // },
  ];

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createAPosts
    );
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDto, true),
      this.modifyPost
    );
    this.router.delete(`${this.path}/:id`, this.deletePost);
  }

  private getAllPosts = (
    request: express.Request,
    response: express.Response
  ) => {
    response.send(this.posts);
  };

  private createAPosts = (
    request: express.Request,
    response: express.Response
  ) => {
    const post: Post = request.body;
    this.posts.push(post);
    response.send(post);
  };

  private getPostById = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const index = this.posts.findIndex((post) => post.id === Number(id));
    if (index != -1) {
      response.send(this.posts[index]);
    } else {
      next(new PostNotFoundExecption(id));
    }
  };

  private modifyPost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const newPost: Post = request.body;
    const index = this.posts.findIndex((post) => post.id === Number(id));
    if (index != -1) {
      this.posts[index].author = newPost.author;
      this.posts[index].content = newPost.content;
      this.posts[index].title = newPost.title;
      response.send(this.posts[index]);
    } else {
      next(new PostNotFoundExecption(id));
    }
  };

  private deletePost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const index = this.posts.findIndex((post) => post.id === Number(id));
    if (index != -1) {
      response.send(`Le post de ${this.posts[index].author} à été supprimé`);
      this.posts.splice(index, 1);
    } else {
      next(new PostNotFoundExecption(id));
    }
  };
}

export default PostsController;

import ProjectsController from "./projects/projects.controller";
import App from "./app";
import PostsController from "./posts/posts.controller";
import "dotenv/config";
import TasksController from "./tasks/tasks.controller";
import UserController from "./users/user.controller";
import AuthentificationController from "./authentification/authentification.controller";

const app = new App([
  new PostsController(),
  new ProjectsController(),
  new TasksController(),
  new UserController(),
  new AuthentificationController(),
]);
app.listen();

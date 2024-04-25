import ProjectsController from "./projects/projects.controller";
import App from "./app";
import PostsController from "./posts/posts.controller";
import "dotenv/config";
import TasksController from "./tasks/tasks.controller";

const app = new App([
  new PostsController(),
  new ProjectsController(new TasksController()),
  new TasksController(),
]);
app.listen();

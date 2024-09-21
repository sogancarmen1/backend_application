import express from "express";
import Controller from "interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import { assignToDto, CreateTaskDto, updateTaskDto } from "./tasks.dto";
import TaskService from "./task.service";
import PostgresTaskRepository from "./postgresTask.repository";
import ProjectService from "../projects/project.service";
import PostgresProjectRepository from "../projects/postgresProject.repository";
import UserService from "../users/user.service";
import PostgresUserRepository from "../users/postgresUser.repository";
import { Result } from "../utils/utils";
import HttpException from "../exceptions/HttpException";
import EmailService from "../mail/email.service";
import { authMiddleware, decodedToken } from "../middlewares/auth.middleware";
import User from "users/user.interface";

class TasksController implements Controller {
  public path = "/tasks";
  public router = express.Router();
  private taskService = new TaskService(
    new PostgresTaskRepository(),
    new ProjectService(
      new PostgresProjectRepository(),
      new UserService(new PostgresUserRepository()),
      new EmailService()
    ),
    new UserService(new PostgresUserRepository()),
    new EmailService()
  );

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    /**
     * @swagger
     * tags:
     *   - name: Tasks
     *     description: Operations about tasks
     */

    /**
     * @swagger
     * /tasks:
     *   post:
     *     tags:
     *       - Tasks
     *     summary: Create a new task
     *     operationId: "createTaskInProject"
     *     requestBody:
     *       description: only the name is REQUIRED, the other field is OPTIONNAL.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateTask'
     *     responses:
     *       '201':
     *         description: task created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       '401':
     *         description: Authorization information is missing or invalid.
     *       '404':
     *         description: Project not found.
     * components:
     *   schemas:
     *     Tasks:
     *       type: object
     *       properties:
     *         sucess:
     *               type: boolean
     *               example: true
     *         message:
     *               type: string
     *               example: ""
     *         data:
     *           type: array
     *           items:
     *             type: object
     *             properties:
     *               id:
     *                 type: integer
     *                 format: int64
     *                 example: 4
     *               name:
     *                   type: string
     *                   example: sleep
     *               dueDate:
     *                   type: date
     *                   example: 2024-12-01
     *               priority:
     *                   type: string
     *                   example: High
     *               status:
     *                   type: string
     *                   example: Low
     *               assignedTo:
     *                   type: string
     *                   example: proat@gmail.com
     *               projectId:
     *                   type: string
     *                   example: 8
     *               taskDescription:
     *                   type: string
     *                   sexample: I need to sleep
     *     Task:
     *       type: object
     *       properties:
     *         sucess:
     *           type: boolean
     *           example: false
     *         message:
     *           type: string
     *           example: ""
     *         data:
     *           type: object
     *           properties:
     *             id:
     *               type: integer
     *               format: int64
     *               example: 4
     *             name:
     *               type: string
     *               example: sleep
     *             dueDate:
     *               type: date
     *               example: 2024-12-01
     *             priority:
     *               type: string
     *               example: High
     *             status:
     *               type: string
     *               example: Low
     *             assignedTo:
     *               type: string
     *               example: proat@gmail.com
     *             projectId:
     *               type: string
     *               example: 8
     *             taskDescription:
     *               type: string
     *               example: I need to sleep
     *     CreateTask:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           example: "write a document"
     *           required: true
     *         dueDate:
     *           type: date
     *           example: 2020-04-08
     *         priority:
     *            type: string
     *            example: High
     *         status:
     *            type: string
     *            example: Done
     *         projectId:
     *            type: integer
     *            format: int64
     *            example: 10
     *         assignedTo:
     *            type: string
     *            example: legrand2@gmail.com
     *         description:
     *           type: string
     *           example: "the description of task"
     *     UpdateTask:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           example: "write a document"
     *           required: true
     *         dueDate:
     *           type: date
     *           example: 2020-04-08
     *         priority:
     *            type: string
     *            example: High
     *         status:
     *            type: string
     *            example: Done
     *         description:
     *           type: string
     *           example: "the description of task"
     *     TaskAssignedTo:
     *        type: object
     *        properties:
     *          userEmail:
     *            type: string
     *            example: legrand2@gmail.com
     *          idProject:
     *            type: integer
     *            format: int64
     *            example: 4
     */
    this.router.post(
      this.path,
      validationMiddleware(CreateTaskDto),
      this.createTaskInProject
    );

    /**
     * @swagger
     * /tasks:
     *   put:
     *     tags:
     *       - Tasks
     *     summary: Updating an existing task
     *     operationId: "modifyTaskInProject"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Task ID
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     requestBody:
     *       description: only the name is REQUIRED, the other field is OPTIONNAL.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateTask'
     *     responses:
     *       '201':
     *         description: task created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       '401':
     *         description: Authorization information is missing or invalid.
     *       '404':
     *         description: Project not found.
     */
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(CreateTaskDto, true),
      this.modifyTaskInProject
    );

    /**
     * @swagger
     * /tasks/{id}:
     *   delete:
     *     tags:
     *       - Tasks
     *     summary: Delete a task
     *     operationId: "deleteTaskInProject"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Task ID
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     responses:
     *       '204':
     *         description: OK
     *       '400':
     *         description: Invalid ID supplied
     *       '404':
     *         description: Project not found
     */
    this.router.delete(`${this.path}/:id`, this.deleteTaskInProject);

    /**
     * @swagger
     * /tasks:
     *   get:
     *     tags:
     *       - Tasks
     *     summary: Find all task by project ID
     *     operationId: "getAllTasksByProject"
     *     parameters:
     *       - name: id
     *         in: query
     *         description: Project ID
     *         schema:
     *           type: integer
     *           format: int64
     *     responses:
     *       '200':
     *         description: successful operation
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Tasks'
     *       '400':
     *         description: Invalid ID supplied
     *       '404':
     *         description: Project not found
     */
    this.router.get(this.path, this.getAllTasksByProject);

    /**
     * @swagger
     * /tasks/{id}:
     *   get:
     *     tags:
     *       - Tasks
     *     summary: Find task by ID
     *     operationId: "getTaskById"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Task ID
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     responses:
     *       '200':
     *         description: successful operation
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Task'
     *       '400':
     *         description: Invalid ID supplied
     *       '404':
     *         description: Project not found
     */
    this.router.get(`${this.path}/:id`, this.getTaskById);

    /**
     * @swagger
     * /tasks/{id}/responsible:
     *   put:
     *     tags:
     *       - Tasks
     *     summary: Assign task to collaborator.
     *     operationId: "assignedTo"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Task ID
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     requestBody:
     *       description: All fields is required
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/TaskAssignedTo'
     *     responses:
     *       '201':
     *         description: task assignation successfull
     *       '401':
     *         description: Authorization information is missing or invalid.
     *       '404':
     *         description: Project not found.
     */
    this.router.put(
      `${this.path}/:id/responsible`,
      authMiddleware,
      this.assignedTo
    );

    /**
     * @swagger
     * /tasks/{id}/responsible/{id1}:
     *   put:
     *     tags:
     *       - Tasks
     *     summary: Unassigned the task.
     *     operationId: "unassigned"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Task ID
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *       - name: id1
     *         in: path
     *         description: Project ID
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     responses:
     *       '201':
     *         description: task unassignation successfull
     */
    this.router.put(`${this.path}/:id/responsible/:id1`, this.unassigned);
  }

  private unassigned = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const id1 = request.params.id1;
      await this.taskService.referTo(Number(id1), Number(id));
      response.send(`Task with id ${id} is unassigned`);
    } catch (error) {
      next(error);
    }
  };

  private assignedTo = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const userDto: assignToDto = request.body;
      const task = await this.taskService.assignTo(Number(id), userDto);
      response.status(200).send(new Result(true, "", null));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private getTaskById = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const task = await this.taskService.findTaskById(Number(id));
      response.status(200).send(new Result(true, "", task));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private createTaskInProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const task: CreateTaskDto = request.body;
      const newTask = await this.taskService.createTask(task);
      response.status(201).send(new Result(true, "", newTask));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private modifyTaskInProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const taskUpdate: updateTaskDto = request.body;
      const taskUpdated = await this.taskService.updateTask(
        Number(id),
        taskUpdate
      );
      response.status(201).send(new Result(true, "", taskUpdated));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private deleteTaskInProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      await this.taskService.deleteTask(Number(id));
      response
        .status(200)
        .send(new Result(true, `Task with id ${id} has delete`, null));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };

  private getAllTasksByProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.query.id;
      const allTasks = await this.taskService.findAllTasksByProject(Number(id));
      response.status(200).send(new Result(true, "", allTasks));
    } catch (error) {
      if (error instanceof HttpException) {
        response
          .status(error.statut)
          .send(new Result(false, error.message, null));
      } else {
        response
          .status(500)
          .send(new Result(false, "Erreur interne du serveur", null));
      }
    }
  };
}

export default TasksController;

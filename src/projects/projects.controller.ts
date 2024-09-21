import express, { Router } from "express";
import Controller from "interfaces/controller.interface";
import validationMiddleware from "../middlewares/validation.middleware";
import { CreateProjectDto, UpdateProjectDto } from "./projects.dto";
import PostgresProjectRepository from "./postgresProject.repository";
import ProjectService from "./project.service";
import PostgresUserRepository from "../users/postgresUser.repository";
import UserService from "../users/user.service";
import Members from "members/members.interface";
import { AddMemberDto } from "members/member.dto";
import { Result } from "../utils/utils";
import HttpException from "../exceptions/HttpException";
import { authMiddleware, decodedToken } from "../middlewares/auth.middleware";
import RequestWithUser from "interfaces/requestWithUser.interface";
import EmailService from "../mail/email.service";

class ProjectsController implements Controller {
  public path = "/projects";
  public router = express.Router();
  private projectService = new ProjectService(
    new PostgresProjectRepository(),
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
     *   - name: Projects
     *     description: Operations about projects
     * /projects:
     *   get:
     *     tags:
     *       - Projects
     *     summary: Returns the list of user's projects
     *     operationId: "getAllProjects"
     *     responses:
     *       '200':
     *         description: successful operation
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Projects'
     *       '401':
     *         description: Authorization information is missing or invalid.
     * components:
     *   schemas:
     *     Projects:
     *       type: array
     *       items:
     *         type: object
     *         properties:
     *           id:
     *             type: integer
     *             format: int64
     *             example: 2
     *           name:
     *             type: string
     *             example: MyProject
     *           description:
     *             type: string
     *             example: Description of MyProject
     */
    this.router.get(this.path, authMiddleware, this.getAllProjects);

    /**
     * @swagger
     * /projects:
     *   post:
     *     tags:
     *       - Projects
     *     summary: Create a new project
     *     operationId: "createProject"
     *     requestBody:
     *       description: name is REQUIRED but description is OPTIONNAL.
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateProject'
     *     responses:
     *       '201':
     *         description: project created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Project'
     *       '401':
     *         description: Authorization information is missing or invalid.
     * components:
     *   schemas:
     *     Project:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *           format: int64
     *           example: 4
     *         name:
     *           type: string
     *           example: write a document
     *         description:
     *           type: string
     *           example: write a documentation of document
     *     CreateProject:
     *       type: object
     *       properties:
     *         name:
     *           type: string
     *           example: "write a document"
     *         description:
     *           type: string
     *           example: "write a documentation of document"
     */
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(CreateProjectDto),
      this.createProject
    );

    /**
     * @swagger
     * /projects/{id}:
     *    put:
     *      tags:
     *        - Projects
     *      summary: Updating an existing project
     *      operationId: "modifyProject"
     *      parameters:
     *        - name: id
     *          in: path
     *          description: Project ID
     *          required: true
     *          schema:
     *            type: integer
     *            format: int64
     *      requestBody:
     *        description: name is REQUIRED but description is OPTIONNAL.
     *        required: true
     *        content:
     *          application/json:
     *            schema:
     *              $ref: '#/components/schemas/CreateProject'
     *      responses:
     *        '200':
     *          description: successfull operation
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Project'
     *        '400':
     *          description: Invalid ID supplied
     *        '404':
     *          description: Project not found
     *        '405':
     *          description: Validation exception
     */
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(UpdateProjectDto, true),
      this.modifyProject
    );

    /**
     * @swagger
     * /projects/{id}:
     *   delete:
     *     tags:
     *       - Projects
     *     summary: Delete a project
     *     operationId: "deleteProject"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Project ID
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
    this.router.delete(`${this.path}/:id`, this.deleteProject);

    /**
     * @swagger
     * /projects/{id}:
     *   get:
     *     tags:
     *       - Projects
     *     summary: Find project by ID
     *     operationId: "getProjectById"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Project ID
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
     *               $ref: '#/components/schemas/Project'
     *       '400':
     *         description: Invalid ID supplied
     *       '404':
     *         description: Project not found
     */
    this.router.get(`${this.path}/:id`, this.getProjectById);

    /**
     * @swagger
     * /projects/{id}/members:
     *   post:
     *     tags:
     *       - Projects
     *     summary: Add members to project
     *     operationId: "addMembers"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Project ID
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *     requestBody:
     *       description: Email of member(s) which added
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/AddMembers'
     *     responses:
     *       '200':
     *         description: successful operation
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Members'
     *       '400':
     *         description: Invalid ID supplied
     *       '404':
     *         description: Project not found
     *       '405':
     *         description: Validation exception
     * components:
     *   schemas:
     *     AddMembers:
     *       type: array
     *       items:
     *         type: object
     *         properties:
     *           userEmail:
     *             type: string
     *             example: user@gmail.com
     *     Members:
     *       type: array
     *       items:
     *         type: object
     *         properties:
     *           id:
     *             type: integer
     *             format: int64
     *             example: 8
     *           email:
     *             type: string
     *             example: useranomyme@gmail.com
     *           roleType:
     *             type: string
     *             enum: [user, owner]
     *             example: user
     */
    this.router.post(`${this.path}/:id/members`, this.addMembers);

    /**
     * @swagger
     * /projects/{id}/member:
     *   post:
     *     tags:
     *       - Projects
     *     summary: Find member by ID
     *     operationId: "getMemberById"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Project ID
     *         required: true
     *         schema:
     *           type: integer
     *           format: int64
     *       - name: idProject
     *         in: query
     *         schema:
     *           type: integer
     *           format: int64
     *     responses:
     *       '200':
     *         description: successful operation
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Member'
     *       '400':
     *         description: Invalid ID supplied
     *       '404':
     *         description: Project not found
     * components:
     *   schemas:
     *     Member:
     *       type: object
     *       properties:
     *         id:
     *           type: integer
     *           format: int64
     *           example: 8
     *         email:
     *           type: string
     *           example: useranomyme@gmail.com
     *         roleType:
     *           type: string
     *           enum: [user, owner]
     *           example: owner
     */
    this.router.get(`${this.path}/:id/member`, this.getMemberById);

    this.router.delete(`${this.path}/:id/members`, this.removeMembers);

    /**
     * @swagger
     * /projects/{id}/members:
     *   get:
     *     tags:
     *       - Projects
     *     summary: Get all members of a project  # Correction du résumé
     *     operationId: "getAllMembers"
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Project ID
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
     *               $ref: '#/components/schemas/Members'
     *       '400':
     *         description: Invalid ID supplied
     *       '404':
     *         description: Project not found
     */
    this.router.get(`${this.path}/:id/members`, this.getAllMembers);
  }

  private getAllMembers = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const members: Members[] = await this.projectService.findAllMembers(
        Number(id)
      );
      response.status(200).send(new Result(true, "", members));
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

  private removeMembers = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const usersId = request.query.usersId;
      const myTab = [];
      for (let i = 0; i < Number(usersId.length.toString()); i++) {
        myTab.push(usersId[i]);
      }
      await this.projectService.removeMembers(myTab, Number(id));
      response.send(
        `Users with id ${usersId} has remove from project with id ${id}`
      );
    } catch (error) {
      next(error);
    }
  };

  private getMemberById = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const idUser = request.params.id;
      const idProject = request.query.idProject;
      const member: Members = await this.projectService.findMemberById(
        Number(idProject),
        Number(idUser)
      );
      response.send(member);
    } catch (error) {
      next(error);
    }
  };

  private addMembers = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = request.params.id;
      const members: AddMemberDto[] = request.body;
      const membersAdded = await this.projectService.addMembers(
        members,
        Number(id)
      );
      response.send(membersAdded);
    } catch (error) {
      next(error);
    }
  };

  private getAllProjects = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const myCookie = request.cookies["Authorization"];
      const id = decodedToken(myCookie);
      const allProjects = await this.projectService.findAllProjectsForUser(
        Number(id)
      );
      response.status(200).send(new Result(true, "", allProjects));
    } catch (error) {
      next(error);
      // if (error instanceof HttpException) {
      //   response
      //     .status(error.statut)
      //     .send(new Result(false, error.message, null));
      // } else {
      //   response
      //     .status(500)
      //     .send(new Result(false, "Erreur interne du serveur", null));
      // }
    }
  };

  private createProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const myCookie = request.cookies["Authorization"];
      const id = decodedToken(myCookie);
      const project: CreateProjectDto = request.body;
      project.userId = Number(id);
      const newProject = await this.projectService.createProject(project);
      response.status(201).send(new Result(true, "", newProject));
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

  private modifyProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    const newProject: UpdateProjectDto = request.body;
    try {
      const projectUpdated = await this.projectService.updateProject(
        Number(id),
        newProject
      );
      response.status(200).send(new Result(true, "", projectUpdated));
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

  private deleteProject = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id = request.params.id;
    try {
      await this.projectService.deleteProject(Number(id));
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

  private getProjectById = async (
    request: express.Request,
    response: express.Response
  ) => {
    try {
      const id = request.params.id;
      const projectFound = await this.projectService.findProjectById(
        Number(id)
      );
      response.status(200).send(new Result(true, "", projectFound));
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

export default ProjectsController;

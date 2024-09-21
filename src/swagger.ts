import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "ProAt API",
      version: "1.0.0",
      description: "Documentation of ProAt API",
      contact: {
        email: "sogancarmen1@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: [
    "./src/projects/*.ts",
    "./src/tasks/*.ts",
    "./src/authentification/*.ts",
    "./src/users/*.ts",
  ],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };

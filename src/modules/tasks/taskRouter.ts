import { FastifyInstance } from "fastify";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./taskController";
import protect from "../middleware/authMiddleware";

const taskRouter = async (fastify: FastifyInstance) => {
  try {
    fastify.get("/api/", { preHandler: protect }, getTasks);

    fastify.get("/api/:id", getTaskById);

    fastify.post(
      "/api/post/",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              task: { type: "string" },
            },
            required: ["task"],
          },
        },
      },
      createTask,
    );

    fastify.put(
      "/api/update/:id",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              task: { type: "string" },
            },
            required: ["task"],
          },
        },
      },
      updateTask,
    );

    fastify.delete(
      "/api/delete/:id",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              task: { type: "string" },
            },
          },
        },
      },
      deleteTask,
    );
  } catch (error) {
    console.error(error);
  }
};

export default taskRouter;

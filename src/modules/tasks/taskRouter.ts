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
    fastify.get("/", { preHandler: protect }, getTasks);

    fastify.get("/:id", getTaskById);

    fastify.post(
      "/",
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
      "/:id",
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
      "/:id",
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

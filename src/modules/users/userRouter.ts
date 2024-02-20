import { FastifyInstance } from "fastify";
import {
  registerUser,
  authenticateUser,
  getUserProfile,
} from "./userController";
import protect from "../middleware/authMiddleware";

const userRouter = async (fastify: FastifyInstance) => {
  try {
    fastify.get("/api/user", { preHandler: protect }, getUserProfile);

    fastify.post(
      "/api/register",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              name: { type: "string" },
              email: { type: "string" },
              password: { type: "string" },
            },
          },
        },
      },
      registerUser,
    );

    fastify.post(
      "/api/authenticate",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              email: { type: "string" },
              password: { type: "string" },
            },
          },
        },
      },
      authenticateUser,
    );
  } catch (error) {
    console.error(error);
  }
};

export default userRouter;

import { FastifyInstance } from "fastify";
import { registerUser, authenticateUser } from "./userController";
import requireAuth from "../middleware/authMiddleware";

const userRouter = async (fastify: FastifyInstance) => {
  try {
    fastify.addHook("preHandler", requireAuth);

    fastify.post(
      "/register",
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
      "/authenticate",
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

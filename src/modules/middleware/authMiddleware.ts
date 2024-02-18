import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}

const protect = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authorizationHeader = request.headers["authorization"];

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new Error("Invalid or missing token");
    }

    const token = authorizationHeader.substring(7);

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (error, decodedToken) => {
        if (error) {
          console.error("Error during token verification:", error);
          throw new Error("Invalid token");
        } else {
          console.log("Token verified successfully");
          request.user = decodedToken;
        }
      },
    );
  } catch (error) {
    console.error("Error during token validation:", error);
    reply.code(401).send({ error: "Unauthorized" });
  }
};

export default protect;

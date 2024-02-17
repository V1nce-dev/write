import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";

const requireAuth = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = request.headers["authorization"];

    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET as string,
        (error, decodedToken) => {
          if (error) {
            console.log(error.message);
          } else {
            console.log(decodedToken);
          }
        },
      );
    }
  } catch (error) {
    console.error(error);
  }
};

export default requireAuth;

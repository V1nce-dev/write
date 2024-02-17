import Fastify from "fastify";
import formData from "@fastify/formbody";
import dotenv from "dotenv";
import { db } from "./database";

import taskRouter from "./modules/tasks/taskRouter";
import userRouter from "./modules/users/userRouter";

const fastify = Fastify({
  logger: {
    level: "info",
  },
});

dotenv.config();

fastify.decorate("db", db);
fastify.register(formData);

fastify.register(taskRouter);
fastify.register(userRouter);

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
    console.log("running on port 8080");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();

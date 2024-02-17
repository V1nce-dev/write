import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../database/index";
import { tasks } from "../../database/schema";
import { eq } from "drizzle-orm";

interface IBody {
  task: string;
}

interface IParams {
  id: number;
}

const getTasks = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await db.select().from(tasks);
    reply.code(200).send(result);
  } catch (error) {
    console.error(error);
  }
};

const getTaskById = async (
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;

    const task = await db.select().from(tasks).where(eq(tasks.id, id));
    reply.code(200).send(task);
  } catch (error) {
    console.error(error);
  }
};

const createTask = async (
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
) => {
  try {
    const { task } = request.body;

    const newTask = await db.insert(tasks).values({ task }).returning();
    reply.code(201).send(newTask);
  } catch (error) {
    console.error(error);
  }
};

const updateTask = async (
  request: FastifyRequest<{ Body: IBody; Params: IParams }>,
  reply: FastifyReply,
) => {
  try {
    const { task } = request.body;
    const { id } = request.params;

    const updatedTask = await db
      .update(tasks)
      .set({ task })
      .where(eq(tasks.id, id))
      .returning();
    reply.code(201).send(updatedTask);
  } catch (error) {
    console.error(error);
  }
};

const deleteTask = async (
  request: FastifyRequest<{ Params: IParams }>,
  reply: FastifyReply,
) => {
  try {
    const { id } = request.params;

    const deleteTask = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();
    reply.code(201).send(deleteTask);
  } catch (error) {
    console.error(error);
  }
};

export { getTasks, getTaskById, createTask, updateTask, deleteTask };

import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../database/index";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id: string | null) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

interface IBody {
  name: string;
  email: string;
  password: string;
}

const registerUser = async (
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
) => {
  try {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      return reply.code(400).send("Please add all fields");
    }

    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userExists.length > 0) {
      return reply.code(400).send("This user already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword })
      .returning();

    if (user) {
      return reply.code(201).send({
        id: user.id,
        name: user.name,
        email: user.email,
        created: user.createdAt,
        token: generateToken(user.id),
      });
    } else {
      reply.code(400).send("Invalid user data");
    }
  } catch (error) {
    console.error(error);
    return reply.code(500).send("Internal Server Error");
  }
};

const authenticateUser = async (
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = request.body;

    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      return reply.code(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      reply.code(400).send("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
  }
};

export { registerUser, authenticateUser };

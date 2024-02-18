import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../database/index";
import { users } from "../../database/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id: string | null) => {
  if (id) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: "30d",
    });
  } else {
    throw new Error("Invalid user ID for token generation");
  }
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

const getUserProfile = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = request.user?.id; // Assuming the user ID is set in the request by the protect middleware

    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const userProfile = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (userProfile.length > 0) {
      reply.send(userProfile[0]);
    } else {
      reply.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

export { registerUser, authenticateUser, getUserProfile };

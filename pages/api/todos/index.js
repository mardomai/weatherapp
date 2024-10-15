import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(todos);
  } else if (req.method === "POST") {
    const { title } = req.body;
    if (!session.user?.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const todo = await prisma.todo.create({
      data: {
        title,
        userId: session.user.id
      },
    });
    return res.status(201).json(todo);
  }
}

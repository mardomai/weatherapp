import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.query;

  if (req.method === "PUT") {
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo || todo.userId !== session.user.id) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const { title } = req.body;
    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: title ? { title } : { completed: !todo.completed },
    });

    return res.status(200).json(updatedTodo);
  } else if (req.method === "DELETE") {
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo || todo.userId !== session.user.id) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await prisma.todo.delete({
      where: { id },
    });

    return res.status(204).end();
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

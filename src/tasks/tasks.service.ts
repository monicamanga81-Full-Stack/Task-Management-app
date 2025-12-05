import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: string, data: any) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        createdBy: userId,
        updatedBy: userId,
      },
    });
  }

  async getTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { createdBy: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateTask(id: string, userId: string, data: any) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...data,
        updatedBy: userId,
      },
    });
  }
}

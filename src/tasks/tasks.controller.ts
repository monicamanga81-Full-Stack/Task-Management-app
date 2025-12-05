import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Request() req, @Body() body) {
    return this.tasksService.createTask(req.user.id, body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  findAll(@Request() req) {
    return this.tasksService.getTasks(req.user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":id")
  update(@Param("id") id: string, @Body() body, @Request() req) {
    return this.tasksService.updateTask(id, req.user.id, body);
  }
}

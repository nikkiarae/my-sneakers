import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'

@Injectable()
export class TodoService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.todo.findMany({ orderBy: { createdAt: 'desc' } })
  }

  findOne(id: number) {
    return this.prisma.todo.findUnique({ where: { id } })
  }

  create(dto: CreateTodoDto) {
    return this.prisma.todo.create({ data: dto })
  }

  update(id: number, dto: UpdateTodoDto) {
    return this.prisma.todo.update({ where: { id }, data: dto })
  }

  remove(id: number) {
    return this.prisma.todo.delete({ where: { id } })
  }
}

import { Injectable } from '@nestjs/common'
import { Prisma, UserStatus } from '@prisma/client'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    })
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    })
  }

  create(data: Prisma.UserUncheckedCreateInput) {
    return this.prisma.user.create({
      data,
      include: { role: true },
    })
  }

  update(id: string, data: Prisma.UserUncheckedUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { role: true },
    })
  }

  listManagedUsers() {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      include: { role: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  setStatus(id: string, status: UserStatus, suspendedUntil?: Date | null) {
    return this.prisma.user.update({
      where: { id },
      data: { status, suspendedUntil },
      include: { role: true },
    })
  }
}

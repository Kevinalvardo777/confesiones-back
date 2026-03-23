import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma, UserStatus } from '@prisma/client'
import { RoleEnum } from 'src/common/enums/role.enum'
import type { CurrentUserData } from 'src/common/interfaces/current-user.interface'
import { UsersRepository } from 'src/modules/users/infrastructure/repositories/users.repository'
import { UpdateProfileDto } from 'src/modules/users/presentation/dto/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getMe(currentUser: CurrentUserData) {
    const user = await this.usersRepository.findById(currentUser.id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.toProfile(user)
  }

  async getById(id: string) {
    const user = await this.usersRepository.findById(id)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.toProfile(user)
  }

  async updateMe(currentUser: CurrentUserData, dto: UpdateProfileDto) {
    const user = await this.usersRepository.update(currentUser.id, {
      displayName: dto.displayName,
      settings: dto.settings as Prisma.InputJsonValue | undefined,
    })

    return this.toProfile(user)
  }

  async listForAdmin() {
    const users = await this.usersRepository.listManagedUsers()
    return users.map((user) => this.toProfile(user))
  }

  async suspendUser(id: string, until?: Date) {
    const user = await this.usersRepository.setStatus(id, UserStatus.SUSPENDED, until ?? null)
    return this.toProfile(user)
  }

  async deactivateUser(id: string) {
    const user = await this.usersRepository.setStatus(id, UserStatus.INACTIVE)
    return this.toProfile(user)
  }

  async blockUser(id: string) {
    const user = await this.usersRepository.setStatus(id, UserStatus.BLOCKED)
    return this.toProfile(user)
  }

  private toProfile(user: {
    id: string
    email: string
    displayName: string
    isGuest: boolean
    status: UserStatus
    settings: unknown
    createdAt: Date
    updatedAt: Date
    role: { name: string }
  }) {
    return {
      id: user.id,
      email: user.email,
      name: user.displayName,
      role: user.role.name as RoleEnum,
      isGuest: user.isGuest,
      status: user.status,
      settings: user.settings,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
  }
}

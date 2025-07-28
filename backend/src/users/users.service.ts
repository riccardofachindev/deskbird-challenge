import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async seedTestData(): Promise<{ message: string; count: number }> {
    const mockUsers = [
      { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com' },
      { firstName: 'Emma', lastName: 'Johnson', email: 'emma.johnson@example.com' },
      { firstName: 'Michael', lastName: 'Williams', email: 'michael.williams@example.com' },
      { firstName: 'Sarah', lastName: 'Brown', email: 'sarah.brown@example.com' },
      { firstName: 'David', lastName: 'Jones', email: 'david.jones@example.com' },
      { firstName: 'Lisa', lastName: 'Garcia', email: 'lisa.garcia@example.com' },
      { firstName: 'James', lastName: 'Miller', email: 'james.miller@example.com' },
      { firstName: 'Maria', lastName: 'Davis', email: 'maria.davis@example.com' },
      { firstName: 'Robert', lastName: 'Rodriguez', email: 'robert.rodriguez@example.com' },
      { firstName: 'Jennifer', lastName: 'Martinez', email: 'jennifer.martinez@example.com' },
      { firstName: 'William', lastName: 'Hernandez', email: 'william.hernandez@example.com' },
      { firstName: 'Patricia', lastName: 'Lopez', email: 'patricia.lopez@example.com' },
      { firstName: 'Charles', lastName: 'Gonzalez', email: 'charles.gonzalez@example.com' },
      { firstName: 'Linda', lastName: 'Wilson', email: 'linda.wilson@example.com' },
      { firstName: 'Christopher', lastName: 'Anderson', email: 'christopher.anderson@example.com' },
      { firstName: 'Barbara', lastName: 'Thomas', email: 'barbara.thomas@example.com' },
      { firstName: 'Daniel', lastName: 'Taylor', email: 'daniel.taylor@example.com' },
      { firstName: 'Susan', lastName: 'Moore', email: 'susan.moore@example.com' },
      { firstName: 'Paul', lastName: 'Jackson', email: 'paul.jackson@example.com' },
      { firstName: 'Karen', lastName: 'Martin', email: 'karen.martin@example.com' },
      { firstName: 'Mark', lastName: 'Lee', email: 'mark.lee@example.com' },
      { firstName: 'Nancy', lastName: 'Perez', email: 'nancy.perez@example.com' },
      { firstName: 'Donald', lastName: 'Thompson', email: 'donald.thompson@example.com' },
      { firstName: 'Betty', lastName: 'White', email: 'betty.white@example.com' },
      { firstName: 'Steven', lastName: 'Harris', email: 'steven.harris@example.com' }
    ];

    const defaultPassword = await bcrypt.hash('password123', 10);
    let seededCount = 0;

    for (const userData of mockUsers) {
      const existingUser = await this.userRepository.findOne({
        where: { email: userData.email },
      });

      if (!existingUser) {
        const user = this.userRepository.create({
          ...userData,
          password: defaultPassword,
          role: UserRole.USER,
        });

        await this.userRepository.save(user);
        seededCount++;
      }
    }

    return {
      message: `Successfully seeded ${seededCount} test users`,
      count: seededCount
    };
  }
}

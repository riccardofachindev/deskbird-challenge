import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserSeeder } from './seeds/user.seed';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserSeeder],
})
export class DatabaseModule {}

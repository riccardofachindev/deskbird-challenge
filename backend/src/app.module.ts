import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        const dbType = configService.get('DATABASE_TYPE', 'postgres');
        
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite',
            database: configService.get('DATABASE_NAME', 'deskbird.sqlite'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          };
        }
        
        // If DATABASE_URL is provided (like on Render), use it
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            ssl: {
              rejectUnauthorized: false
            }
          };
        }
        
        // Otherwise use individual variables (for local development)
        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST', 'localhost'),
          port: +configService.get('DATABASE_PORT', 5432),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

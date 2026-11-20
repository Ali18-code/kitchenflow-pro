import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Entities
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

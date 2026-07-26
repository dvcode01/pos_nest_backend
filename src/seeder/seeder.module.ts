import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from '../config/typeorm.config';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      TypeOrmModule.forRootAsync({
        useFactory: typeORMConfig,
        inject: [ConfigService]
      }), 
    ],
  providers: [SeederService]
})
export class SeederModule {}

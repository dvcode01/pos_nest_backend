import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
    
});




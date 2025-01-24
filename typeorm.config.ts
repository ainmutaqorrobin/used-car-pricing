import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    switch (process.env.NODE_ENV) {
      case 'development':
        return {
          type: this.configService.get<any>('DB_TYPE'),
          synchronize: JSON.parse(
            this.configService.get<string>('SYNCHRONIZE'),
          ),
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
        };
      case 'test':
        return {
          type: this.configService.get<any>('DB_TYPE'),
          synchronize: JSON.parse(
            this.configService.get<string>('SYNCHRONIZE'),
          ),
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: JSON.parse(
            this.configService.get<string>('MIGRATIONS_RUN'),
          ),
        };
      case 'production':
        const obj = {
          type: this.configService.get<any>('DB_TYPE'),
          synchronize: JSON.parse(
            this.configService.get<string>('SYNCHRONIZE'),
          ),
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          migrationsRun: JSON.parse(
            this.configService.get<string>('MIGRATIONS_RUN'),
          ),
        };

        return obj;
      default:
        throw new Error('Unknown environment');
    }
  }
}

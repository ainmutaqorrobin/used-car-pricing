import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    const baseConfig = {
      type: this.configService.get<any>('DB_TYPE'),
      synchronize: JSON.parse(this.configService.get<string>('SYNCHRONIZE')),
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrations: ['src/migrations/**/*.ts'],
    };

    switch (process.env.NODE_ENV) {
      case 'development':
        return {
          ...baseConfig,
        };
      case 'test':
        return {
          ...baseConfig,
          migrationsRun: JSON.parse(
            this.configService.get<string>('MIGRATIONS_RUN'),
          ),
        };
      case 'production':
        return {
          ...baseConfig,
          migrationsRun: JSON.parse(
            this.configService.get<string>('MIGRATIONS_RUN'),
          ),
          url: JSON.parse(this.configService.get<string>('DATABASE_URL')),
          entities: ['**/*.entity.js'],
          ssl: { rejectUnauthorized: false }, //Hiroku config
        };

      default:
        throw new Error('Unknown environment');
    }
  }
}

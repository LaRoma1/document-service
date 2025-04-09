// import { registerAs } from '@nestjs/config';

// export default registerAs('app', () => ({
//   port: parseInt(process.env.PORT ?? '3010', 10),
//   database: {
//     host: process.env.DATABASE_HOST ?? 'localhost',
//     port: parseInt(process.env.DATABASE_PORT ?? '5432', 10) || 5432,
//     username: process.env.DATABASE_USER ?? 'postgres',
//     password: process.env.DATABASE_PASSWORD ?? 'postgres',
//     name: process.env.DATABASE_NAME ?? 'gestionnaire',
//   },
//   jwtSecret: process.env.JWT_SECRET,
// }));


export const databaseConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'romadev',
  database: process.env.DB_DATABASE || 'document_service',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
};
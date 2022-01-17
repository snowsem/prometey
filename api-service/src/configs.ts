export const typeOrmConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['database/migrations/**/*.js'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'database/migrations',
    subscribersDir: 'src/subscriber',
  },
};

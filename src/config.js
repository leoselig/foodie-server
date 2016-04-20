export const database = {
  "host": process.env.DATABASE_HOST || 'localhost',
  "port": process.env.DATABASE_PORT || 3306,
  "database": process.env.DATABASE_DB_NAME || 'foodie',
  "username": process.env.DATABASE_USERNAME || 'foodie',
  "password": process.env.DATABASE_PASSWORD || ''
};

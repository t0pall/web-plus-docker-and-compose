require('dotenv').config();

const {
  JWT_SECRET,
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_HOST,
} = process.env;

module.exports = {
  apps: [
    {
      name: 'kpd-backend',
      script: './dist/main.js',
      production_env: {
        JWT_SECRET,
        POSTGRES_PASSWORD,
        POSTGRES_USER,
        POSTGRES_DB,
        POSTGRES_HOST,
      },
    },
  ],
};

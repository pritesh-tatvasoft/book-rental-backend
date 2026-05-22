import * as Joi from 'joi';

const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  JWT_SECRET: Joi.string().default('your_jwt_secret_key'),
  JWT_EXPIRATION: Joi.string().default('1h'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_USERNAME: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('postgres'),
  DATABASE_NAME: Joi.string().default('rental_booking_db'),
  MONGODB_URI: Joi.string().default(
    'mongodb://localhost:27017/rental_booking_audit',
  ),
  SUPABASE_URL: Joi.string().default('https://your-supabase-url.supabase.co'),
  SUPABASE_SERVICE_KEY: Joi.string().default('your_supabase_service_key'),
  SUPABASE_ANON_KEY: Joi.string().default('your_supabase_anon_key'),
});

export default validationSchema;

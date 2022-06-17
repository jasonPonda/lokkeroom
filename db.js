import pg from 'pg'
const {Pool} = pg

let localPoolConfig = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host:'localhost',
  port:'5432',
  database: process.env.PGDATABASE
}

const poolConfig = process.env.DATABASE_URL ? {
  connectionString:process.env.DATABASE_URL,
  ssl:{rejectUnauthorized: false } 
} : localPoolConfig;

const pool = new Pool(poolConfig)
export default pool


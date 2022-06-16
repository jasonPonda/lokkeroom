import pg from 'pg'
const {Pool} = pg

let localPoolConfig = {
  user:'jason_admin',
  password:'123salut!',
  host:'localhost',
  port:'5432',
  database:'lokkeroom'
}

const poolConfig = process.env.DATABASE_URL ? {
  connectionString:process.env.DATABASE_URL,
  ssl:{rejectUnauthorized: false } 
} : localPoolConfig;

const pool = new Pool(poolConfig)
export default pool


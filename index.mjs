import pg from 'pg'
import express from 'express'
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'
import { promisify } from 'util'


const {Pool} = pg;

dotenv.config();


const pool = new Pool();
await pool.connect();

// Lauching express
const app = express();

// Promisify the JWT helpers
// => transform callback into Promise based function (async)
const sign = promisify(JWT.sign);
const verify = promisify(JWT.verify);

// Use the json middleware to parse the request body
app.use(express.json()) // => req.body

app.post('/api/register', async (req, res) => {
    const {nickname, email, password } = req.body;

    if(!nickname || !email || !password){
        res.status(418).send({ message: 'Invalid request!'})
    }

    try {
        const encryptedPassword = await bcrypt.hash(password, 10);

        await pool.query('INSERT INTO users (nickname, email, password) VALUES ($1,$2,$3)',
        [nickname, email, encryptedPassword]
        );

        return res.send({ info: 'users succesfully created'})
    } catch (err) {
        console.log(err);

        return res.status(500).send({ message: 'Internal server error'})
    }
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) 
    return res.status(400).send({ message: 'Invalid request'})

    const q = await pool.query('SELECT password, id, nickname from users WHERE email=$1', 
    [email]
    )

    if(q.rowCount === 0) {
        return res.status(404).send({ message:'This user does not exist'})
    }

    const result = q.rows[0]
    const match = await bcrypt.compare(password, result.password)

    if(!match) {
        return res.status(403).send({ message:'Wrong password'})
    }

    try {
        const token = await sign(
            { id: result.id, nickname: result.nickname, email},
            process.env.JWT_SECRET,
            {
                algorithm: 'HS512',
                expireIn: '1h',
            }
        )

        return res.send({ token })
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Cannot generate token'})
    }
})


// This middleware will ensure that all subsequent routes include a valid token in the authorization header
// The 'user' variable will be added to the request object, to be used in the following request listeners
app.use(async (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).send('Unauthorized')
  
    try {
      const decoded = await verify(
        req.headers.authorization.split(' ')[1],
        process.env.JWT_SECRET
      )
  
      if (decoded !== undefined) {
        req.user = decoded
        return next()
      }
    } catch (err) {
      console.log(err)
    }
  
    return res.status(403).send('Invalid token')
  })

//get 
app.get('/api/hello', (req, res) => {
    res.send({ info: 'Hello ' + req.user.nickname})
})

app.get('/api/lobby', async (req, res) => {
    const allLobby = await pool.query(`SELECT * from lobby`);

    res.send(allLobby.rows)
})

app.get('/api/lobby/:id', async (req, res) => {
    const lobbyId = await pool.query(`SELECT id from lobby`);

    res.send(lobbyId.rows)
})

app.get('/api/users', async (req, res) => {
    const q = await pool.query(`SELECT nickname from users`);

    res.send(q.rows)
})

app.post('/api/lobby/:id', async (req, res) => {
    pool.query(`INSERT INTO users (nickname, email, password) VALUES ($1, $2, $3)`, [req.body.nickname, req.body.email, req.body.password])
    return res.send({info: 'utilisateur stocké'})
})

app.listen(5000, () => {
    console.log('http://localhost:5000');
});
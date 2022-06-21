import express from 'express'
import pool from '../db.js'
import bcrypt from 'bcrypt'
import { authenticateToken } from '../middleware/authorization.js'

const router = express.Router()

router.get('/',authenticateToken, async (req, res) => {
    try{
        const users = await pool.query('SELECT id, email, nickname FROM users')
        res.json({user: users.rows})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = await pool.query('INSERT INTO users (nickname, email, password) VALUES ($1,$2,$3) RETURNING *', [req.body.nickname, req.body.email, hashedPassword])
        //res.json({users:newUser.rows[0]})
        if(newUser.rowCount)
            res.status(200).json({message: 'succes'})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.get('/hello', async (req, res) => {
    try {
        const users = await pool.query('SELECT nickname FROM users', [req.body.nickname])
        res.send(users.rows)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
    
})

router.get('/lobby', async (req, res) => {
    const allLobby = await pool.query(`SELECT * from lobby`);

    res.send(allLobby.rows)
})

router.get('/lobby/:id', async (req, res) => {
    const lobbyId = await pool.query(`SELECT id from lobby`);

    res.send(lobbyId.rows)
})

export default router
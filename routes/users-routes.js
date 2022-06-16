import express from 'express'
import pool from '../db.js'
import bcrypt from 'bcrypt'
import { authenticateToken } from '../middleware/authorization.js'

const router = express.Router()

router.get('/',authenticateToken, async (req, res) => {
    try{
        const users = await pool.query('SELECT * FROM users')
        res.json({user: users.rows})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.post('/', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = await pool.query('INSERT INTO users (nickname, email, password) VALUES ($1,$2,$3) RETURNING *', [req.body.nickname, req.body.email, hashedPassword])
        res.json({users:newUser.rows[0]})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

export default router
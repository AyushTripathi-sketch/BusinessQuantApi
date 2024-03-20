const mysql = require('mysql2/promise');
const router = require("express").Router();
require('dotenv').config()


const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

router.get('/api', async (req, res) => {
    const ticker = req.query.ticker;
    const column = req.query.column;
    const period = req.query.period;

    let attributes = ['ticker', 'date', 'revenue', 'fcf','gp']; // Default columns

    if (column) {
        attributes = column.split(',');
    }

    let query = `SELECT ${attributes.join(',')} FROM data WHERE ticker = ?`;
    const params = [ticker.toUpperCase()];

    // Include period if specified
    if (period) {
        let pastDate;
        if (period.endsWith('y')) { // Year
            const years = parseInt(period);
            pastDate = new Date(new Date().getFullYear() - years, 0, 1);
        } else if (period.endsWith('m')) { // Month
            const months = parseInt(period);
            pastDate = new Date();
            pastDate.setMonth(pastDate.getMonth() - months);
        }

        if (pastDate) {
            query += ` AND date >= ?`;
            params.push(pastDate);
        }
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query(query, params);
        connection.release();
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports=router
const express = require('express')
const { Pool } = require('pg')

const app = express()

const port = 3000

const pool = new Pool({
	user: 'plasmaintec',
	host: 'localhost',
	database: 'plasmaintec',
	password: '',
	port: 5432,
})  

app.use(express.json());

app.get('/', (req, res) => {
	res.status(200).send('Please use the /return or /assign endpoints')
})

app.post('/return', (req, res) => {
	pool.query(`
		UPDATE Item 
		SET customerid=null 
		WHERE itemname=$1
		RETURNING *;`, 
	[req.query.item])	
		.then(query => res.status(201).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.post('/assign', (req, res) => {
	pool.query(`
		UPDATE Item 
		SET customerid = ( 
			SELECT customerid 
			FROM Customer 
			WHERE customername=$2 
		) 
		WHERE itemname=$1
		RETURNING *;`, 
	[req.query.item, req.query.name])
		.then(query => res.status(201).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
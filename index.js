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

app.use(express.static('public'))

app.use(express.json());

app.get('/inventory', (req, res) => {
	pool.query(`
		SELECT i.itemname, c.customername, i.itemid, c.customerid, i.cartid
		FROM Customer c 
		RIGHT OUTER JOIN Item i
		ON c.customerid=i.customerid;`
	)
		.then(query => res.status(200).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.get('/owner', (req, res) => {
	pool.query(`
		SELECT DISTINCT ON (i.itemid) i.itemid, i.customerid, i.itemname
		FROM Customer c 
		JOIN Item i 
		ON (i.customerid IS NULL OR c.customerid=i.customerid) AND i.itemid=$1;`,
	[req.query.item])
		.then(query => res.status(200).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
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

app.post('/returnToCart', (req, res) => {
	pool.query(`
		UPDATE Item 
		SET customerid=null, cartid=$2
		WHERE itemname=$1
		RETURNING *;`, 
	[req.query.item, req.query.cart])	
		.then(query => res.status(201).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.post('/returnToCartById', (req, res) => {
	pool.query(`
		UPDATE Item 
		SET customerid=null, cartid=$2
		WHERE itemid=$1
		RETURNING *;`, 
	[req.query.item, req.query.cart])	
		.then(query => res.status(201).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.post('/returnById', (req, res) => {
	pool.query(`
		UPDATE Item 
		SET customerid=null
		WHERE itemid=$1
		RETURNING *;`, 
	[req.query.item])	
		.then(query => res.status(201).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.post('/emptyCartById', (req, res) => {
	pool.query(`
		UPDATE Item 
		SET cartid=null 
		WHERE cartid=$1;`, 
	[req.query.cart])	
		.then(query => res.status(201).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.post('/assign', (req, res) => {
	pool.query(`
		UPDATE Item i 
		SET customerid = c.customerid 
		FROM Customer c 
		WHERE i.itemname=$1 AND c.customername=$2 
		RETURNING *;`, 
	[req.query.item, req.query.name])
		.then(query => res.status(201).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.post('/assignById', (req, res) => {
	pool.query(`
		UPDATE Item i 
		SET customerid = c.customerid 
		FROM Customer c 
		WHERE i.itemid=$1 AND c.customerid=$2 
		RETURNING *;`, 
	[req.query.item, req.query.name])
		.then(query => res.status(201).json({ query: query.rows }))
		.catch(error => res.status(400).json({ error }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
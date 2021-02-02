const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// morgan
app.use(morgan('dev'));

app.get('/', async (req, res) => {
	try {
		const allUsers = await prisma.user.findMany();
		return res.status(200).json(allUsers);
	} catch (error) {
		res.status(400).json(error);
	} finally {
		await prisma.$disconnect();
	}
});

app.post('/', async (req, res) => {
	try {
		const payload = req.body;
		console.log(payload);
		const user = await prisma.user.create({
			data: payload
		});
		return res.status(200).json(user);
	} catch (error) {
		res.status(400).json(error);
	} finally {
		await prisma.$disconnect();
	}
});

app.put('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const payload = req.body;
		console.log(payload, id);
		const user = await prisma.user.update({
			where: { id: parseInt(id) },
			data: payload
		});
		return res.status(200).json(user);
	} catch (error) {
		res.status(400).json(error);
	} finally {
		await prisma.$disconnect();
	}
});

app.delete('/:id', async (req, res) => {
	try {
		const id = req.params.id;
		await prisma.user.delete({
			where: { id: parseInt(id) }
		});
		return res.status(200).send('Deleted Successfully');
	} catch (error) {
		res.status(400).json(error);
	} finally {
		await prisma.$disconnect();
	}
});

const port = process.env.PORT || 4000;

app.listen(port, () => console.log(`http://localhost:${port}`));

const express = require('express');
const serverless = require('serverless-http');
const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();

app.get('/', (req, res) => {
	res.send('API is working with Vercel Serverless!');
});

app.get('/users', async (req, res) => {
	const users = await prisma.user.findMany();
	res.json(users);
});

module.exports.handler = serverless(app);

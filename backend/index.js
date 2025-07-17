const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.send('Hello from Vercel Serverless!');
});

const serverless = require('serverless-http');
module.exports.handler = serverless(app);

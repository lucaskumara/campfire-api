const express = require('express');
const mongo = require('mongodb');
const validateToken = require('./utils/authorization.js');

// Load environment variables
require('dotenv').config({ path: '../.env' });

const lobbiesRoute = require('./routes/lobbies.js');
const reputationRoute = require('./routes/reputation.js');
const tagsRoute = require('./routes/tags.js');

const app = express();

const mongoClient = new mongo.MongoClient(process.env.DB_URI);
const mongoDatabase = mongoClient.db(process.env.DB_NAME);

// Bind database to the express app
app.locals.db = mongoDatabase;

// Set middleware + routes
app.use(express.json());
app.use(validateToken);

app.use('/lobbies', lobbiesRoute);
app.use('/reputation', reputationRoute);
app.use('/tags', tagsRoute);

app.listen(3000);
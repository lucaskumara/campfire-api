const express = require('express');

const lobbiesRoute = require('./routes/lobbies.js');
const reputationRoute = require('./routes/reputation.js');
const tagsRoute = require('./routes/tags.js');

const app = express();

app.use('/lobbies', lobbiesRoute)
app.use('/reputation', reputationRoute)
app.use('/tags', tagsRoute)

app.listen(3000);
const express = require('express');

const app = express();

app.get('/lobbies', async (req, res) => {
    res.send('Lobbies response')
});

app.get('/profile', async (req, res) => {
    res.send('Profile response')
});

app.get('/reputation', async (req, res) => {
    res.send('Reputation response')
});

app.get('/tags', async (req, res) => {
    res.send('Tags respond')
});

app.listen(3000);
const express = require('express');

const router = express.Router();

router.get('/get/:guildId/:tagName', async (req, res) => {
    const { guildId, tagName } = req.params
    res.send('Send tag information')
})

router.get('/list/:guildId', async (req, res) => {
    const { guildId } = req.params
    res.send('List guild tags')
})

router.get('/list/:guildId/:authorId', async (req, res) => {
    const { guildId, authorId } = req.params
    res.send('List guild author tags')
})

router.get('/count/:guildId', async (req, res) => {
    const { guildId } = req.params
    res.send('Count guild tags')
})

router.get('/count/:guildId/:authorId', async (req, res) => {
    const { guildId, authorId } = req.params
    res.send('Count guild author tags')
})

router.patch('/increment/:guildId/:tagName', async (req, res) => {
    res.send('Increment tag uses')
})

router.patch('/decrement/:guildId/:tagName', async (req, res) => {
    res.send('Decrement tag uses')
})

router.patch('/edit/:guildId/:authorId/:tagName', async (req, res) => {
    const { guildId, authorId, tagName } = req.params
    const { tagContent } = req.body
    res.send('Update guild tag')
})

router.post('/create', async (req, res) => {
    const { guildId, authorId, tagName, tagContent } = req.body
    res.send('Create guild tag')
})

router.delete('/delete/:guildId/:authorId/:tagName', async (req, res) => {
    const { guildId, authorId, tagName } = req.params
    res.send('Deletes guild tag')
})

router.delete('/purge/:guildId/:authorId', async (req, res) => {
    const { guildId, authorId } = req.params
    res.send('Purges all guild tags')
})

module.exports = router
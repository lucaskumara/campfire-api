const express = require('express');

const router = express.Router();

router.get('/count/:guildId', async (request, response) => {
    const { guildId } = request.params;
    response.json({
        operation: 'Guild tag count',
        guildId: guildId
    })
})

router.get('/count/:guildId/:memberId', async (request, response) => {
    const { guildId, memberId } = request.params;
    response.json({
        operation: 'Guild member tag count',
        guildId: guildId,
        memberId: memberId
    })
})

router.get('/list/:guildId', async (request, response) => {
    const { guildId } = request.params;
    response.json({
        operation: 'Guild tag list',
        guildId: guildId
    })
})

router.get('/list/:guildId/:memberId', async (request, response) => {
    const { guildId, memberId } = request.params;
    response.json({
        operation: 'Guild member tag list',
        guildId: guildId,
        memberId: memberId
    })
})

router.get('/get/:guildId', async (request, response) => {
    const { guildId } = request.params;
    const { tagName } = request.body;
    response.json({
        operation: 'Guild get tag',
        guildId: guildId,
        tagName: tagName
    })
})

router.post('/create/:guildId', async (request, response) => {
    const { guildId } = request.params;
    const { tagName, tagContent, tagAuthor } = request.body;
    response.json({
        operation: 'Guild create tag',
        guildId: guildId,
        tagName: tagName,
        tagContent: tagContent,
        tagAuthor: tagAuthor
    })
})

router.delete('/delete/:guildId', async (request, response) => {
    const { guildId } = request.params;
    const { tagName } = request.body;
    response.json({
        operation: 'Guild delete tag',
        guildId: guildId,
        tagName: tagName
    })
})

router.put('/edit/:guildId', async (request, response) => {
    const { guildId } = request.params;
    const { tagName, tagContent } = request.body;
    response.json({
        operation: 'Guild edit tag',
        guildId: guildId,
        tagName: tagName,
        tagContent: tagContent
    })
})

router.put('/increment/:guildId', async (request, response) => {
    const { guildId } = request.params;
    const { tagName } = request.body;
    response.json({
        operation: 'Guild increment tag',
        guildId: guildId,
        tagName: tagName
    })
})

router.delete('/purge/:guildId', async (request, response) => {
    const { guildId } = request.params;
    response.json({
        operation: 'Guild purge',
        guildId: guildId
    })
})

module.exports = router
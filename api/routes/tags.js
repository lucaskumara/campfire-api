const express = require('express');

const router = express.Router();

router.get('/:guildId/count', async (request, response) => {
    const { guildId } = request.params;
    response.json({
        operation: 'Guild tag count',
        guildId: guildId
    })
})

router.get('/:guildId/:memberId/count', async (request, response) => {
    const { guildId, memberId } = request.params;
    response.json({
        operation: 'Guild member tag count',
        guildId: guildId,
        memberId: memberId
    })
})

router.get('/:guildId/list', async (request, response) => {
    const { guildId } = request.params;
    response.json({
        operation: 'Guild tag list',
        guildId: guildId
    })
})

router.get('/:guildId/:memberId/list', async (request, response) => {
    const { guildId, memberId } = request.params;
    response.json({
        operation: 'Guild member tag list',
        guildId: guildId,
        memberId: memberId
    })
})

router.get('/:guildId/get', async (request, response) => {
    const { guildId } = request.params;
    const { tagName } = request.body;
    response.json({
        operation: 'Guild get tag',
        guildId: guildId,
        tagName: tagName
    })
})

router.post('/:guildId/create', async (request, response) => {
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

router.delete('/:guildId/delete', async (request, response) => {
    const { guildId } = request.params;
    const { tagName } = request.body;
    response.json({
        operation: 'Guild delete tag',
        guildId: guildId,
        tagName: tagName
    })
})

router.put('/:guildId/edit', async (request, response) => {
    const { guildId } = request.params;
    const { tagName, tagContent } = request.body;
    response.json({
        operation: 'Guild edit tag',
        guildId: guildId,
        tagName: tagName,
        tagContent: tagContent
    })
})

router.put('/:guildId/increment', async (request, response) => {
    const { guildId } = request.params;
    const { tagName } = request.body;
    response.json({
        operation: 'Guild increment tag',
        guildId: guildId,
        tagName: tagName
    })
})

router.put('/:guildId/decrement', async (request, response) => {
    const { guildId } = request.params;
    const { tagName } = request.body;
    response.json({
        operation: 'Guild decrement tag',
        guildId: guildId,
        tagName: tagName
    })
})

router.delete('/:guildId/purge', async (request, response) => {
    const { guildId } = request.params;
    response.json({
        operation: 'Guild purge',
        guildId: guildId
    })
})

module.exports = router
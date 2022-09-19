const express = require('express');

const router = express.Router();

router.get('/count/:guildId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    // Count the tags associated with the guild
    const cursor = collection.aggregate([
        { $match: { 'guild_id': guildId } },
        { $unwind: '$tags' },
        { $count: 'tag_count' }
    ])

    const tagCountArray = await cursor.toArray();
    const tagCount = tagCountArray.length == 0 ? 0 : tagCountArray[0].tag_count;

    response.status = 200;
    response.json({
        tag_count: tagCount
    })
})

router.get('/count/:guildId/:memberId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);
    const memberId = parseInt(request.params.memberId);

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    // Count the tags associated with the guild authored by the member
    const cursor = collection.aggregate([
        { $match: { 'guild_id': guildId } },
        { $unwind: '$tags' },
        { $match: { 'tags.author_id': memberId } },
        { $count: 'tag_count' }
    ])

    const tagCountArray = await cursor.toArray();
    const tagCount = tagCountArray.length == 0 ? 0 : tagCountArray[0].tag_count;

    response.status = 200;
    response.json({
        tag_count: tagCount
    })
})

router.get('/list/:guildId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    // Pull all tags associated with the guild
    const cursor = collection.aggregate([
        { $match: { 'guild_id': guildId } },
        { $unwind: '$tags' }
    ])

    const tagArray = await cursor.toArray();

    response.status = 200;
    response.json(tagArray.map((document) => {
        return {
            name: document.tags.name,
            content: document.tags.content,
            author_id: document.tags.author_id,
            created_at_iso: document.tags.created_at_iso,
            modified_at_iso: document.tags.modified_at_iso,
            uses: document.tags.uses
        }
    }))
})

router.get('/list/:guildId/:memberId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);
    const memberId = parseInt(request.params.memberId);

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    // Pull all tags associated with the guild authored by the member
    const cursor = collection.aggregate([
        { $match: { 'guild_id': guildId } },
        { $unwind: '$tags' },
        { $match: { 'tags.author_id': memberId } }
    ])

    const tagArray = await cursor.toArray();

    response.status = 200;
    response.json(tagArray.map((document) => {
        return {
            name: document.tags.name,
            content: document.tags.content,
            author_id: document.tags.author_id,
            created_at_iso: document.tags.created_at_iso,
            modified_at_iso: document.tags.modified_at_iso,
            uses: document.tags.uses
        }
    }))
})

router.get('/get/:guildId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);
    const tagName = request.body.tagName;

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    // Pull all tags associated with the guild with the tag name
    const cursor = collection.aggregate([
        { $match: { 'guild_id': guildId } },
        { $unwind: '$tags' },
        { $match: { 'tags.name': tagName } }
    ])

    const tagArray = await cursor.toArray();

    response.status = 200;
    response.json(tagArray.map((document) => {
        return {
            name: document.tags.name,
            content: document.tags.content,
        }
    }))
})

router.post('/create/:guildId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);
    const tagName = request.body.tagName;
    const tagContent = request.body.tagContent;
    const tagAuthorID = request.body.tagAuthorID;

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    const creationTime = new Date();
    const creationTimeISO = creationTime.toISOString();

    // Update the guild tags list to contain the specified tag
    await collection.updateOne(
        { 'guild_id': guildId },
        {
            $push: {
                tags: {
                    name: tagName,
                    content: tagContent,
                    author_id: tagAuthorID,
                    created_at_iso: creationTimeISO,
                    modified_at_iso: creationTimeISO,
                    uses: 0,
                }
            }
        },
        { upsert: true }
    )

    response.status = 200;
    response.json({
        message: 'Tag created successfully'
    })
})

router.delete('/delete/:guildId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);
    const tagName = request.body.tagName;

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    // Update the guild tags list to remove the specified tag
    await collection.updateOne(
        { 'guild_id': guildId },
        {
            $pull: {
                tags: {
                    name: tagName
                }
            }
        }
    )

    response.status = 200;
    response.json({
        message: 'Tag deleted successfully'
    })
})

router.put('/edit/:guildId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);
    const tagName = request.body.tagName;
    const tagContent = request.body.tagContent;

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    const modifiedTime = new Date();
    const modifiedTimeISO = modifiedTime.toISOString();

    // Update the specified tag to edit its contents
    await collection.updateOne(
        { 'guild_id': guildId, 'tags.name': tagName },
        {
            $set: {
                'tags.$.content': tagContent,
                'tags.$.modified_at_iso': modifiedTimeISO
            }
        }
    )

    response.status = 200;
    response.json({
        message: 'Tag edited successfully'
    })
})

router.put('/increment/:guildId', async (request, response) => {
    const guildId = parseInt(request.params.guildId);
    const tagName = request.body.tagName;

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    // Update the specified tag to increment its uses by 1
    await collection.updateOne(
        { 'guild_id': guildId, 'tags.name': tagName },
        {
            $inc: {
                'tags.$.uses': 1
            }
        }
    )

    response.status = 200;
    response.json({
        message: 'Tag uses incremented successfully'
    })
})

router.delete('/purge/:guildId', async (request, response) => {
    const guildID = parseInt(request.params.guildId);

    const database = request.app.locals.db;
    const collection = database.collection('tags');

    // Deletes all tag data regarding the guild
    await collection.deleteOne(
        { guild_id: guildID }
    )

    response.status = 200;
    response.json({
        message: 'Guild data deleted successfully'
    })
})

module.exports = router
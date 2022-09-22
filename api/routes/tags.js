const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

/**
 * Gets the database collection from the request.
 * 
 * @param {express.Request} request 
 * @returns {mongodb.Collection}
 */
function getCollection(request) {
    return request.app.locals.db.collection('tags');
}

/**
 * Gets a list of guilds that are present in the database.
 * 
 * @param {express.Request} request 
 * @returns {Array.<integer>}
 */
async function getGuilds(request) {
    const collection = getCollection(request)
    const cursor = collection.find({}).project({ 'guild_id': 1, _id: 0 });
    const guildDocumentsArray = await cursor.toArray();

    return guildDocumentsArray.map((document) => {
        return document.guild_id;
    })
}

/**
 * Gets the number of tags in a guild. Optionally gets the number
 * of tags in a guild authored by a member.
 * 
 * @param {express.Request} request 
 * @param {integer} guildID 
 * @param {integer} [memberID] 
 * @returns {integer}
 */
async function getTagCount(request, guildID, memberID = null) {
    const collection = getCollection(request);
    let pipeline;

    switch (memberID) {
        case null:
            pipeline = [
                { $match: { 'guild_id': guildID } },
                { $unwind: '$tags' },
                { $count: 'tag_count' }
            ]
            break;
        default:
            pipeline = [
                { $match: { 'guild_id': guildID } },
                { $unwind: '$tags' },
                { $match: { 'tags.author_id': memberID } },
                { $count: 'tag_count' }
            ]
            break;
    }

    const cursor = collection.aggregate(pipeline);
    const tagCountArray = await cursor.toArray();
    const tagCount = tagCountArray.length == 0 ? 0 : tagCountArray[0].tag_count;

    return tagCount;
}

/**
 * Gets a list of tags in a guild. Optionally gets a list
 * of tags in a guild authored by a member.
 * 
 * @param {express.Request} request 
 * @param {integer} guildID 
 * @param {integer} [memberID] 
 * @returns {Array.<Object>}
 */
async function getTagList(request, guildID, memberID = null) {
    const collection = getCollection(request);
    let pipeline;

    switch (memberID) {
        case null:
            pipeline = [
                { $match: { 'guild_id': guildID } },
                { $unwind: '$tags' }
            ]
            break;
        default:
            pipeline = [
                { $match: { 'guild_id': guildID } },
                { $unwind: '$tags' },
                { $match: { 'tags.author_id': memberID } }
            ]
            break;
    }

    const cursor = collection.aggregate(pipeline).project({ 'tags': 1, _id: 0 });
    const tagArray = await cursor.toArray();

    return tagArray.map((document) => {
        return document.tags
    })
}

/**
 * Gets a tag from a guild.
 * 
 * @param {express.Request} request 
 * @param {integer} guildID 
 * @param {integer} tagName 
 * @returns {Object}
 */
async function getTag(request, guildID, tagName) {
    const collection = getCollection(request);
    const cursor = collection.aggregate([
        { $match: { 'guild_id': guildID } },
        { $unwind: '$tags' },
        { $match: { 'tags.name': tagName } },
        { $limit: 1 }
    ])
    const tagArray = await cursor.toArray();

    switch (tagArray.length) {
        case 0:
            return null;
        default:
            return tagArray[0].tags;
    }
}

/**
 * Creates a tag in a guild.
 * 
 * @param {express.Request} request 
 * @param {integer} guildID 
 * @param {string} tagName 
 * @param {string} tagContent 
 * @param {integer} tagAuthorID 
 */
async function createTag(request, guildID, tagName, tagContent, tagAuthorID) {
    const collection = getCollection(request);
    const creationTime = new Date();
    const creationTimeISO = creationTime.toISOString();

    await collection.updateOne(
        { 'guild_id': guildID },
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
}

/**
 * Deletes a tag in a guild.
 * 
 * @param {express.Request} request 
 * @param {integer} guildID 
 * @param {string} tagName 
 */
async function deleteTag(request, guildID, tagName) {
    const collection = getCollection(request);

    await collection.updateOne(
        { 'guild_id': guildID },
        {
            $pull: {
                tags: {
                    name: tagName
                }
            }
        }
    )
}

/**
 * Edits a tag in a guild.
 * 
 * @param {express.Request} request 
 * @param {integer} guildID 
 * @param {string} tagName 
 * @param {string} tagContent 
 */
async function editTag(request, guildID, tagName, tagContent) {
    const collection = getCollection(request);
    const modifiedTime = new Date();
    const modifiedTimeISO = modifiedTime.toISOString();

    await collection.updateOne(
        { 'guild_id': guildID, 'tags.name': tagName },
        {
            $set: {
                'tags.$.content': tagContent,
                'tags.$.modified_at_iso': modifiedTimeISO
            }
        }
    )
}

/**
 * Increments the number of uses of a tag in a guild.
 * 
 * @param {express.Request} request 
 * @param {integer} guildID 
 * @param {string} tagName 
 */
async function incrementTagUses(request, guildID, tagName) {
    const collection = getCollection(request);

    // Update the specified tag to increment its uses by 1
    await collection.updateOne(
        { 'guild_id': guildID, 'tags.name': tagName },
        {
            $inc: {
                'tags.$.uses': 1
            }
        }
    )
}

/**
 * Purges all information about a guild from the db.
 * 
 * @param {express.Request} request 
 * @param {integer} guildID 
 */
async function purgeGuildData(request, guildID) {
    const collection = getCollection(request);

    await collection.deleteOne(
        { guild_id: guildID }
    )
}

router.get('/guilds', async (request, response) => {
    const guildIDs = await getGuilds(request);

    response.status(200).json(guildIDs);
})

router.get('/count/:guildId', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const tagCount = await getTagCount(request, guildID);

    response.status(200).json({
        tag_count: tagCount
    })
})

router.get('/count/:guildId/:memberId', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const memberID = parseInt(request.params.memberId);
    const tagCount = await getTagCount(request, guildID, memberID);

    response.status(200).json({
        tag_count: tagCount
    })
})

router.get('/list/:guildId', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const tags = await getTagList(request, guildID);

    response.status(200).json(tags)
})

router.get('/list/:guildId/:memberId', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const memberID = parseInt(request.params.memberId);
    const tags = await getTagList(request, guildID, memberID);

    response.status(200).json(tags)
})

router.get('/get/:guildId/:tagName', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const tagName = request.params.tagName;
    const tag = await getTag(request, guildID, tagName);

    if (tag == null) {
        response.status(404).json({
            message: 'Tag not found'
        })
    } else {
        response.status(200).json(tag);
    }
})

router.post('/create/:guildId', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const tagName = request.body.tagName;
    const tagContent = request.body.tagContent;
    const tagAuthorID = request.body.tagAuthorID;

    const tag = await getTag(request, guildID, tagName);

    if (tag == null) {
        await createTag(request, guildID, tagName, tagContent, tagAuthorID);

        response.status(200).json({
            message: 'Tag created successfully'
        })
    } else {
        response.status(409).json({
            message: 'Tag already exists'
        })
    }
})

router.delete('/delete/:guildId/:tagName', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const tagName = request.params.tagName;

    const tag = await getTag(request, guildID, tagName);

    if (tag != null) {
        await deleteTag(request, guildID, tagName);

        response.status(200).json({
            message: 'Tag deleted successfully'
        })
    } else {
        response.status(409).json({
            message: 'Tag does not exist'
        })
    }
})

router.patch('/edit/:guildId/:tagName', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const tagName = request.params.tagName;
    const tagContent = request.body.tagContent;

    const tag = await getTag(request, guildID, tagName);

    if (tag != null) {
        await editTag(request, guildID, tagName, tagContent);

        response.status(200).json({
            message: 'Tag edited successfully'
        })
    } else {
        response.status(409).json({
            message: 'Tag does not exist'
        })
    }
})

router.patch('/increment/:guildId/:tagName', async (request, response) => {
    const guildID = parseInt(request.params.guildId);
    const tagName = request.params.tagName;

    const tag = await getTag(request, guildID, tagName);

    if (tag != null) {
        await incrementTagUses(request, guildID, tagName);

        response.status(200).json({
            message: 'Tag uses incremented successfully'
        })
    } else {
        response.status(409).json({
            message: 'Tag does not exist'
        })
    }
})

router.delete('/purge/:guildId', async (request, response) => {
    const guildID = parseInt(request.params.guildId);

    const guilds = await getGuilds(request);

    if (guilds.includes(guildID)) {
        await purgeGuildData(request, guildID);

        response.status(200).json({
            message: 'Guild data deleted successfully'
        })
    } else {
        response.status(409).json({
            message: 'Guild data does not exist'
        })
    }
})

module.exports = router
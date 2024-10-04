const sharp = require('sharp');
const axios = require('axios')

const database = require('../database')
const { getImageUrl } = require('../../public/utils')
const { ComicStory } = require('../models')

async function getMultipleHeightAndWidths({ comicstories }){
    const trx = await database.transaction()
    try{

        const savedComicStories = [];

        for (let index = 0; index < comicstories.length; index++) {
            const comicstory = comicstories[index];
            const result = await getHeightAndWidth(comicstory);
            if (result && result.width && result.height) {
                savedComicStories.push(result);
            }
        }
                
        const issueUuids = new Set(savedComicStories.map(comicstory => comicstory.issueUuid))
        const seriesUuids = new Set(savedComicStories.map(comicstory => comicstory.seriesUuid))
        const issueUuidArray = Array.from(issueUuids);
        const seriesUuidArray = Array.from(seriesUuids);
        const issueUuid = issueUuidArray.length === 1 ? issueUuidArray[0] : null;
        const seriesUuid = seriesUuidArray.length === 1 ? seriesUuidArray[0] : null;

        if (!issueUuid || !seriesUuid) {
            throw new Error('getMultipleHeightAndWidths issueUuid or seriesUuid !== 1')
        }

        const safeSavedComicStories = savedComicStories.map(comicstory => {
            return { 
                uuid: comicstory.uuid,
                width: comicstory.width,
                height: comicstory.height
            }
        })

        await ComicStory.updateComicStories({ trx, stories: safeSavedComicStories, issueUuid, seriesUuid })
        await trx.commit();

    } catch (e) {
        console.log('getMultipleHeightAndWidths error', e)
        await trx.rollback();
    }
}

async function getHeightAndWidth(comicstory){
    try{
        const { uuid, issueUuid, seriesUuid, storyImage } = comicstory;

        const options = {
            method: 'GET',
            url: getImageUrl({ image: storyImage, type: 'story' }),
            timeout: 1000 * 5,
            responseType: 'arraybuffer',
            maxContentLength: 10485760
        };

        const response = await axios(options);
        const buffer = Buffer.from(response.data, 'binary');
        const image = await sharp(buffer).metadata();
        const { width, height } = image;
        return { uuid, issueUuid, seriesUuid, width, height }
    } catch (e) {
        console.log('getHeightAndWidth - error downloading image', comicstory && comicstory.uuid)
    }
}

module.exports = {
    getHeightAndWidth,
    getMultipleHeightAndWidths,
}

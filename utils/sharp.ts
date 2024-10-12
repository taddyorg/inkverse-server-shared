import sharp, { type Metadata } from 'sharp';
import axios, { type AxiosRequestConfig } from 'axios';
import { Knex } from 'knex';
import database from '../database/index.js';
import type { ComicStory } from '../../public/models/comicstory.js';
import { getStoryImageUrl } from '../../public/models/comicstory.js';
import { updateMultipleComicStories } from '../models/comicstory.js';
    
async function getMultipleHeightAndWidths(comicstories: ComicStory[] ) {
    const trx: Knex.Transaction = await database.transaction()
    try{

        const savedComicStories: ComicStory[] = [];

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

        const safeSavedComicStories: ComicStory[] = savedComicStories.map(comicstory => {
            return { 
                uuid: comicstory.uuid,
                issueUuid,
                seriesUuid,
                width: comicstory.width,
                height: comicstory.height
            }
        })

        await updateMultipleComicStories(trx, safeSavedComicStories, issueUuid, seriesUuid)
        await trx.commit();

    } catch (e) {
        console.log('getMultipleHeightAndWidths error', e)
        await trx.rollback();
    }
}

async function getHeightAndWidth(comicstory?: ComicStory): Promise<ComicStory | undefined> {
    if (!comicstory) { return undefined; }

    try{
        const { uuid, issueUuid, seriesUuid, storyImage } = comicstory;

        const options: AxiosRequestConfig = {
            method: 'GET',
            url: getStoryImageUrl(comicstory),
            timeout: 1000 * 5,
            responseType: 'arraybuffer',
            maxContentLength: 10485760
        };

        const response = await axios(options);
        const buffer = Buffer.from(response.data, 'binary');
        const image: Metadata = await sharp(buffer).metadata();
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

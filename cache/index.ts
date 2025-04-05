import axios from "axios";
import { GraphQLClient, gql } from 'graphql-request';
import { getInkverseUrl, inkverseWebsiteUrl } from "../../public/utils.js";

type CacheType = 
  'everything' |
  'documentation' |
  'sitemap' |
  'comicseries' |
  'comicissue' |
  'comicstory' |
  'creator' |
  'creatorcontent' |
  'recentlyAdded' |
  'recentlyUpdated'

interface PurgeCacheParams {
  type: CacheType;
  id?: string;
  ids?: string[];
  shortUrl?: string;
  name?: string;
}

export async function purgeCacheOnCdn({ type, id, shortUrl, name }: PurgeCacheParams) {
  if (process.env.NODE_ENV !== "production") {
    console.log('LocalHost purgeCacheOnCdn', type, id, shortUrl, name);
  }

  switch (type) {
    case 'everything':
    case 'documentation':
    case 'comicseries':
    case 'creator':
    case 'recentlyAdded':
    case 'recentlyUpdated':
      if (!id) { throw new Error('purgeCacheOnCdn - id is required for type: ' + type); }

      await purgeApiCache(type, id)
      await purgeWebsiteCache(type, id, shortUrl, name)
      return
    case 'comicissue':
    case 'comicstory':
    case 'creatorcontent':
      if (!id) { throw new Error('purgeCacheOnCdn - id is required for type: ' + type); }

      return await purgeApiCache(type, id)
    case 'sitemap':
      return await purgeWebsiteCache(type, id, shortUrl, name)
    default:
      throw new Error(`inside purgeEvent() - Dont have logic for type: ${type}`)
  }
}

export async function purgeMultipleCacheOnCdn({ type, ids }: PurgeCacheParams) {
  if (process.env.NODE_ENV !== "production") {
    console.log('LocalHost purgeMultipleCacheOnCdn', type, ids);
  }

  switch (type) {
    case 'comicissue':
    case 'comicstory':
    case 'creatorcontent':
    case 'recentlyAdded':
    case 'recentlyUpdated':
      if (!ids) { throw new Error('purgeMultipleCacheOnCdn - ids is required for type: ' + type); }

      await purgeMultipleOnCdn(type, ids)
      return
    default:
      throw new Error(`inside purgeEvent() - Dont have logic for type: ${type}`)
  }
}

function getGraphCDNQuery(type: CacheType) {
  switch (type) {
    case 'everything':
      return `
        mutation {
          _purgeAll
        }
      `
    case 'documentation':
      return `
        mutation {
          _purgeQuery(queries: [getDocumenation])
        }
      `
    case 'comicseries':
      return `
        mutation ComicSeriesPurge ($uuid: [ID!]) {
          purgeComicSeries(uuid: $uuid)
        }
      `
    case 'comicissue':
      return `
        mutation ComicIssuePurge ($uuid: [ID!]) {
          purgeComicIssue(uuid: $uuid)
        }
      `
    case 'comicstory':
      return `
        mutation ComicStoryPurge ($uuid: [ID!]) {
          purgeComicStory(uuid: $uuid)
        }
      `
    case 'creator':
      return `
        mutation CreatorPurge ($uuid: [ID!]) {
          purgeCreator(uuid: $uuid)
        }
      `
    case 'creatorcontent':
      return `
        mutation CreatorContentPurge ($uuid: [ID!]) {
          purgeCreatorContent(uuid: $uuid)
        }
      `
    case 'recentlyAdded':
    case 'recentlyUpdated':
      return `
        mutation HomeScreenComicSeriesPurge ($id: ID!) {
          purgeHomeScreenComicSeries(id: $id)
        }
      `
    default:
      throw new Error(`inside getGraphCDNQuery() - Dont have logic for type: ${type}`)
  }
}

function getGraphCDNVariables(type: CacheType, id?:string, ids?:string[]) {
  switch (type) {
    case 'everything':
    case 'documentation':
      return null
    case 'comicseries':
    case 'comicissue':
    case 'comicstory':
    case 'creator':
    case 'creatorcontent':
    case 'recentlyAdded':
    case 'recentlyUpdated':
      return { uuid: ids || [id] }
    default:
      throw new Error(`inside getGraphCDNVariables() - Dont have logic for type: ${type}`)
  }
}

async function purgeApiCache(type: CacheType, id:string) {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log('LocalHost purgeApiCache', type, id);
      return;
    }

    const query = getGraphCDNQuery(type);
    const variables = getGraphCDNVariables(type, id)
    await postToGraphQL(query, variables);
  } catch (error) {
    console.error('purgeApiCache error', type, error);
  }
}

async function purgeMultipleOnCdn(type: CacheType, ids:string[]) {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log('LocalHost purgeMultipleOnCdn', type, ids);
      return;
    }

    const query = getGraphCDNQuery(type);
    const variables = getGraphCDNVariables(type, undefined, ids)
    await postToGraphQL(query, variables);
  } catch (error) {
    console.error('purgeMultipleOnCdn error', type, error);
  }
}

async function purgeWebsiteCache(type: CacheType, id?:string, shortUrl?:string, name?:string) {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log('LocalHost purgeWebsiteCache', type, id, shortUrl, name);
      return;
    }

    const options = {
      method: 'POST',
      url: `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_TADDY_ZONE_ID}/purge_cache`,
      timeout: 1000 * 5,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      data: getCloudflareDataObject(type, id, shortUrl, name)
    };

    await axios(options);
  } catch (error) {
    console.error('purgeWebsiteCache error', type, error);
  }
}

function getCloudflareDataObject(type: CacheType, id?:string, shortUrl?:string, name?:string) {
  switch (type) {
    case 'everything':
    case 'documentation':
      return { purge_everything: true }
    case 'comicseries':
      return { files: [`${inkverseWebsiteUrl}${getInkverseUrl({ type: 'comicseries', shortUrl })}`] }
    case 'comicissue':
      return { files: [`${inkverseWebsiteUrl}${getInkverseUrl({ type: 'comicissue', shortUrl, name, uuid: id })}`] }
    case 'creator':
      return { files: [`${inkverseWebsiteUrl}${getInkverseUrl({ type: 'creator', shortUrl })}`] }
    case 'sitemap':
      return { files: [`https://ink0.inkverse.co/sitemap/${id}`] }
    case 'recentlyAdded':
    case 'recentlyUpdated':
      return { files: [`${inkverseWebsiteUrl}/`] }
    default:
      throw new Error(`inside getCloudflareDataObject() - Dont have logic for type: ${type}`)
  }
}

async function postToGraphQL(query: string, variables: any) {
  const queryRequest = gql`${query}`;

  const endpointUrl = 'https://admin.stellate.co/inkverse'

  const headers = {
    'Content-Type': 'application/json',
    'stellate-token': process.env.STELLATE_API_TOKEN
  }

  const client = new GraphQLClient(endpointUrl, { headers })
  const data = await client.request(queryRequest, variables)
  return data;
}
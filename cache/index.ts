import axios from "axios";
import { GraphQLClient, gql } from 'graphql-request';
import { getInkverseUrl, InkverseUrlType } from "../../public/utils.js";

export enum CacheType {
  EVERYTHING = 'everything',
  DOCUMENTATION = 'documentation',
  SITEMAP = 'sitemap',
  COMICSERIES = 'comicseries',
  COMICISSUE = 'comicissue',
  COMICSTORY = 'comicstory',
  CREATOR = 'creator',
  CREATOR_CONTENT = 'creatorcontent',
}

export async function purgeCacheOnCdn(type: CacheType, id?:string, shortUrl?:string) {
  if (process.env.NODE_ENV !== "production") {
    console.log('LocalHost purgeCacheOnCdn', type, id);
  }

  switch (type) {
    case CacheType.EVERYTHING:
    case CacheType.DOCUMENTATION:
    case CacheType.COMICSERIES:
    case CacheType.COMICISSUE:
    case CacheType.COMICSTORY:
    case CacheType.CREATOR:
    case CacheType.CREATOR_CONTENT:
    case CacheType.SITEMAP:
      return await purgeEvent(type, id, shortUrl)
    default:
      throw new Error(`inside purgeCacheOnCdn() - Dont have logic for type: ${type}`)
  }
}

async function purgeEvent(type: CacheType, id?:string, shortUrl?:string) {
  switch (type) {
    case CacheType.EVERYTHING:
    case CacheType.DOCUMENTATION:
    case CacheType.COMICSERIES:
    case CacheType.CREATOR:
      await purgeApiCache(type, id)
      await purgeWebsiteCache(type, id, shortUrl)
      return
    case CacheType.COMICISSUE:
    case CacheType.COMICSTORY:
    case CacheType.CREATOR_CONTENT:
      return await purgeApiCache(type, id)
    case CacheType.SITEMAP:
      return await purgeWebsiteCache(type, id, shortUrl)
    default:
      throw new Error(`inside purgeEvent() - Dont have logic for type: ${type}`)
  }
}

function getGraphCDNQuery(type: CacheType) {
  switch (type) {
    case CacheType.EVERYTHING:
      return `
        mutation {
          _purgeAll
        }
      `
    case CacheType.DOCUMENTATION:
      return `
        mutation {
          _purgeQuery(queries: [getDocumenation])
        }
      `
    case CacheType.COMICSERIES:
      return `
        mutation ComicSeriesPurge ($uuid: [ID!]) {
          purgeComicSeries(uuid: $uuid)
        }
      `
    case CacheType.COMICISSUE:
      return `
        mutation ComicIssuePurge ($uuid: [ID!]) {
          purgeComicIssue(uuid: $uuid)
        }
      `
    case CacheType.COMICSTORY:
      return `
        mutation ComicStoryPurge ($uuid: [ID!]) {
          purgeComicStory(uuid: $uuid)
        }
      `
    case CacheType.CREATOR:
      return `
        mutation CreatorPurge ($uuid: [ID!]) {
          purgeCreator(uuid: $uuid)
        }
      `
    case CacheType.CREATOR_CONTENT:
      return `
        mutation CreatorContentPurge ($mergedUuid: [ID!]) {
          purgeCreatorContent(mergedUuid: $mergedUuid)
        }
      `
    // case 'user':
    //   return `
    //     mutation UserPurge ($id: [ID!]) {
    //       purgeUser(id: $id)
    //     }
    //   `
    // case 'privateUser':
    //   return `
    //     mutation PrivateUserPurge ($id: [ID!]) {
    //       purgePrivateUser(id: $id)
    //     }
    //   `
    // case 'homescreenList':
    //   return `
    //     mutation HomeScreenListPurge ($id: [ID!]) {
    //       purgeHomeScreenList(id: $id)
    //     }
    //   `
    // case 'list':
    //   return `
    //       mutation ListPurge($id: [ID!]) {
    //         purgeList(id: $id)
    //       }`
    // case 'getMyLists':
    //   return `
    //       mutation PurgeGetMyLists($userId: ID!) {
    //         purgeQuery_getMyLists(
    //           args: { userId: $userId }
    //         )
    //       }
    //     `
    // case 'getMyListsForItem':
    //   return `
    //       mutation PurgeGetMyListsForItem($userId: ID!, $uuid: ID!) {
    //         purgeQuery_getMyListsForItem(
    //           args: { userId: $userId, uuid: $uuid }
    //         )
    //       }
    //     `
    // case 'getUserById':
    //   return `
    //       mutation PurgeGetUserById($id: ID!) {
    //         purgeQuery_getUserById(
    //           args: { id: $id }
    //         )
    //       }
    //     `
    // case 'recentlyAdded':
    //   return `
    //     mutation PurgeGetRecentlyAddedComicSeries($page: _ArgumentsJSONObject, $limitPerPage: _ArgumentsJSONObject) {
    //       purgeQuery_getRecentlyAddedComicSeries(
    //         args: {page: $page, limitPerPage: $limitPerPage }
    //       )
    //     }
    //   `
    // case 'recentlyUpdated':
    //   return `
    //     mutation PurgeGetRecentlyUpdatedComicSeries($page: _ArgumentsJSONObject, $limitPerPage: _ArgumentsJSONObject) {
    //       purgeQuery_getRecentlyUpdatedComicSeries(
    //         args: {page: $page, limitPerPage: $limitPerPage }
    //       )
    //     }
    //   `
    // case 'comicseriesMiscDetails':
    //   return `
    //     mutation PurgeGetComicSeriesMiscDetails($contentUuid: ID, $contentType: String) {
    //       purgeQuery_getComicSeriesMiscDetails(
    //         args: {contentUuid: $contentUuid, contentType: $contentType}
    //       )
    //     }
    //   `
    // case `contentRecommendations`:
    //   return `
    //     mutation PurgeGetContentRecommendations($contentUuid: ID!, $contentType: String!, $limitPerPage: Int, $page: Int) {
    //       purgeQuery_getContentRecommendations(
    //         args: {contentUuid: $contentUuid, contentType: $contentType, limitPerPage: $limitPerPage, page: $page}
    //       )
    //     }
    //   `
    // case `userRecommendations`:
    //   return `
    //     mutation PurgeGetUserRecommendations($userId: ID!) {
    //       purgeQuery_getUserRecommendations(
    //         args: {userId: $userId, limitPerPage: $limitPerPage, page: $page}
    //       )
    //     }
    //   `
    // case `userContentRecommendations`:
    //   return `
    //     mutation PurgeGetUserContentRecommendations($contentUuid: ID!, $contentType: String!) {
    //       purgeQuery_getUserContentRecommendations(
    //         args: {contentUuid: $contentUuid, contentType: $contentType}
    //       )
    //     }
    //   `
    default:
      throw new Error(`inside getGraphCDNQuery() - Dont have logic for type: ${type}`)
  }
}

function getGraphCDNVariables(type: CacheType, id?:string, ids?:string[]) {
  switch (type) {
    case CacheType.EVERYTHING:
    case CacheType.DOCUMENTATION:
      return null
    case CacheType.COMICSERIES:
    case CacheType.COMICISSUE:
    case CacheType.COMICSTORY:
    case CacheType.CREATOR:
      return { uuid: ids || [id] }
    case CacheType.CREATOR_CONTENT:
      return { uuid: ids || [id] }
    default:
      throw new Error(`inside getGraphCDNVariables() - Dont have logic for type: ${type}`)
  }
}

async function purgeApiCache(type: CacheType, id?:string) {
  try {
    if (!id) {
      throw new Error('purgeApiCache - id is required');
    }else if (process.env.NODE_ENV !== "production") {
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

export async function purgeMultipleOnCdn(type: CacheType, ids:string[]) {
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

async function purgeWebsiteCache(type: CacheType, id?:string, shortUrl?:string) {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log('LocalHost purgeWebsiteCache', type, id, shortUrl);
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
      data: getCloudflareDataObject(type, id, shortUrl)
    };

    await axios(options);
  } catch (error) {
    console.error('purgeWebsiteCache error', type, error);
  }
}

function getCloudflareDataObject(type: CacheType, id?:string, shortUrl?:string) {
  switch (type) {
    case CacheType.EVERYTHING:
    case CacheType.DOCUMENTATION:
      return { purge_everything: true }
    case CacheType.COMICSERIES:
    case CacheType.CREATOR:
      return { files: [getInkverseUrl(InkverseUrlType.CREATOR, id, shortUrl)] }
    case CacheType.SITEMAP:
      return { files: [`https://ink0.inkverse.co/sitemap/${id}`] }
    default:
      throw new Error(`inside getCloudflareDataObject() - Dont have logic for type: ${type}`)
  }
}

async function postToGraphQL(query: string, variables: any) {
  const queryRequest = gql`${query}`;

  const endpointUrl = 'https://admin.stellate.co/inkverse'

  const headers = {
    'Content-Type': 'application/json',
    'stellate-token': process.env.GRAPHCDN_API_TOKEN
  }

  const client = new GraphQLClient(endpointUrl, { headers })
  const data = await client.request(queryRequest, variables)
  return data;
}
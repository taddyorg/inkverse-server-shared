import { ComicSeries, ComicIssue, Creator, CreatorContent, Common } from '../models/index.js';
import { purgeCacheOnCdn, purgeMultipleOnCdn } from '../cache/index.js';
import { getMultipleHeightAndWidths } from '../utils/sharp.js';
// import { fcmSendMulticast } from '../firebase/index.js';

export type TaddyWebhook = {
  taddyType: TADDY_WEBHOOK_TYPE;
  action: TADDY_WEBHOOK_ACTION;
  data: Record<string, any>;
}

export enum TADDY_WEBHOOK_TYPE {
  COMICSERIES = "COMICSERIES",
  COMICISSUE = "COMICISSUE",
  CREATOR = "CREATOR",
  CREATORCONTENT = "CREATORCONTENT",
}

export enum TADDY_WEBHOOK_ACTION {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
}

export async function processWebhook(body: TaddyWebhook) {
  const { taddyType, action } = body;
  switch (taddyType) {
    case TADDY_WEBHOOK_TYPE.COMICSERIES:
      return await processComicSeriesWebhook(body);
    case TADDY_WEBHOOK_TYPE.COMICISSUE:
      return await processComicIssueWebhook(body);
    case TADDY_WEBHOOK_TYPE.CREATOR:
      return await processCreatorWebhook(body);
    case TADDY_WEBHOOK_TYPE.CREATORCONTENT:
      return await processCreatorContentWebhook(body);
    default:
      throw new Error(`processWebhook - Invalid taddyType: ${taddyType}`);
  }
}

async function processComicSeriesWebhook(body: TaddyWebhook) {
  const { taddyType, action, data } = body;
  switch (action) {
    case TADDY_WEBHOOK_ACTION.CREATED: {
      const comicseries = await ComicSeries.addComicSeries({ data });

      if (!comicseries) {
        throw new Error('processComicSeriesWebhook - created - comicseries not found', data.uuid);
      }

      await Promise.allSettled([
        purgeCacheOnCdn({ type: taddyType, id: comicseries.uuid, shortUrl: comicseries.shortUrl }),
        // purgeCacheOnCdn({ type: 'recentlyAdded', id: comicseries.uuid, passedInArgs: { page: 1, limitPerPage: 10 } }),
      ])
      return;
    }
    case TADDY_WEBHOOK_ACTION.UPDATED: {
      const comicseries = await ComicSeries.updateComicSeries(data);  

      if (!comicseries) {
        throw new Error('processComicSeriesWebhook - updated - comicseries not found', data.uuid);
      }
      
      await purgeCacheOnCdn({ type: taddyType, id: comicseries.uuid, shortUrl: comicseries.shortUrl })

      return;
    }
    case TADDY_WEBHOOK_ACTION.DELETED: {
      const deletedComicSeries = await ComicSeries.deleteComicSeries(data);

      if (!deletedComicSeries) {
        throw new Error('processComicSeriesWebhook - deleted - deletedComicSeries not found', data.uuid);
      }

      const { uuids, shortUrl } = deletedComicSeries;
      const [seriesUuid, allIssuesUUids, allStoriesUUids] = uuids;

      await Promise.allSettled([
        purgeCacheOnCdn({ type: 'comicseries', id: seriesUuid, shortUrl }),
        purgeMultipleOnCdn({ type: 'comicissue', id: allIssuesUUids }),
        purgeMultipleOnCdn({ type: 'comicstory', ids: allStoriesUUids }),
      ])

      return;
    }
    default:
      throw new Error('processComicSeriesWebhook - Invalid action');
  }
}

async function processComicIssueWebhook(body: TaddyWebhook) {
  const { taddyType, action, data } = body;
  switch (action) {
    case TADDY_WEBHOOK_ACTION.CREATED: {
      const [comicissue, comicstories] = await ComicIssue.addComicIssue({ data });

      if (!comicissue) {
        throw new Error('processComicIssueWebhook - created - comicissue not found', data.uuid);
      }else if (!comicstories) {
        throw new Error('processComicIssueWebhook - created - comicstories not found', data.uuid);
      }

      // pre-download height and width for each story
      if (!comicissue.scopesForExclusiveContent || comicissue.scopesForExclusiveContent.length === 0) {
        await getMultipleHeightAndWidths(comicstories);
      }

      const comicseries = await ComicSeries.getComicSeriesByUuid(comicissue.seriesUuid);

      if (!comicseries) {
        console.error('processComicIssueWebhook - created - comicseries not found', comicissue.seriesUuid);
      }

      // purge cache
      await Promise.allSettled([
        comicseries ? purgeCacheOnCdn({ type: 'comicseries', id: comicseries.uuid, shortUrl: comicseries.shortUrl }) : [],
        purgeCacheOnCdn({ type: 'comicissue', id: comicissue.uuid }),
        purgeMultipleOnCdn({ type: 'comicstory', ids: comicstories.map(story => story.uuid) }),
        // purgeCacheOnCdn({ type: 'recentlyUpdated', id: comicseries.uuid, passedInArgs: { page: 1, limitPerPage: 10 } }),
      ])

      // push notification
      await sendPushNotification(taddyType, action, data);

      return;
    }
    case TADDY_WEBHOOK_ACTION.UPDATED: {
      const [comicissue, comicstories] = await ComicIssue.updateComicIssue({ data });
      
      if (!comicissue) {
        throw new Error('processComicIssueWebhook - updated - comicissue not found', data.uuid);
      }else if (!comicstories) {
        throw new Error('processComicIssueWebhook - updated - comicstories not found', data.uuid);
      }

      // pre-download height and width for each story
      if (!comicissue.scopesForExclusiveContent || comicissue.scopesForExclusiveContent.length === 0) {
        await getMultipleHeightAndWidths(comicstories);
      }

      const comicseries = await ComicSeries.getComicSeriesByUuid(comicissue.seriesUuid);
      
      if (!comicseries) {
        console.error('processComicIssueWebhook - updated - comicseries not found', comicissue.seriesUuid);
      }
      
      await Promise.allSettled([
        comicseries ? purgeCacheOnCdn({ type: 'comicseries', id: comicseries.uuid, shortUrl: comicseries.shortUrl }) : [],
        purgeCacheOnCdn({ type: 'comicissue', id: comicissue.uuid }),
        purgeMultipleOnCdn({ type: 'comicstory', ids: comicstories.map(story => story.uuid) }),
      ])

      return;
    }
    case TADDY_WEBHOOK_ACTION.DELETED: {
      const { uuids, seriesUuid } = await ComicIssue.deleteComicIssue({ data });
      const [issueUuid, allStoriesUUids] = uuids;
      const comicseries = await ComicSeries.getComicSeriesByUuid(seriesUuid);

      if (!comicseries) {
        console.error('processComicIssueWebhook - deleted - comicseries not found', seriesUuid);
      }

      await Promise.allSettled([
        comicseries ? purgeCacheOnCdn({ type: 'comicseries', id: comicseries.uuid, shortUrl: comicseries.shortUrl }) : [],
        purgeCacheOnCdn({ type: 'comicissue', id: issueUuid }),
        purgeMultipleOnCdn({ type: 'comicstory', ids: allStoriesUUids }),
      ])
      return;
    }
    default:
      throw new Error('processComicIssueWebhook - Invalid action');
  }
}

async function processCreatorWebhook(body: TaddyWebhook) {
  const { taddyType, action, data } = body;
  switch (action) {
    case TADDY_WEBHOOK_ACTION.CREATED: {
      const creator = await Creator.addCreator({ data });

      if (!creator) {
        throw new Error('processCreatorWebhook - created - creator not found', data.uuid);
      }

      await purgeCacheOnCdn({ type: taddyType, id: creator.uuid })
      return;
    }
    case TADDY_WEBHOOK_ACTION.UPDATED: {
      const creator = await Creator.updateCreator({ data });

      if (!creator) {
        throw new Error('processCreatorWebhook - updated - creator not found', data.uuid);
      }

      await purgeCacheOnCdn({ type: taddyType, id: creator.uuid })
      return;
    }
    case TADDY_WEBHOOK_ACTION.DELETED: {
      const { uuids, shortUrl } = await Creator.deleteCreator(data);
      const [creatorUuid, allContentUUids] = uuids;

      if (!creatorUuid) {
        throw new Error('processCreatorWebhook - deleted - creatorUuid not found', data.uuid );
      }

      await Promise.allSettled([
        purgeCacheOnCdn({ type: 'creator', id: creatorUuid, shortUrl }),
        allContentUUids.length > 0 ? purgeMultipleOnCdn({ type: 'creatorcontent', ids: allContentUUids }) : [],
      ])
      return;
    }
    default:
      throw new Error('processCreatorWebhook - Invalid action');
  }
}

async function processCreatorContentWebhook(body: TaddyWebhook) {
  const { taddyType, action, data } = body;
  switch (action) {
    case TADDY_WEBHOOK_ACTION.CREATED: {
      const creatorcontent = await CreatorContent.addOrUpdateCreatorContent(data);

      if (!creatorcontent) {
        throw new Error('processCreatorContentWebhook - created - creatorcontent not found', data.uuid);
      }
      
      const creator = await Creator.getCreatorByUuid(creatorcontent.creatorUuid);

      if (!creator) {
        console.error('processCreatorContentWebhook - created - creator not found', creatorcontent.creatorUuid);
      }

      await Promise.allSettled([
        creator ? purgeCacheOnCdn({ type: 'creator', id: creator.uuid, shortUrl: creator.shortUrl }) : [],
        purgeCacheOnCdn({ type: 'creatorcontent', id: creatorcontent.uuid }),
      ])
      
      // push notification
      await sendPushNotification(taddyType, action, data);

      return;
    }
    case TADDY_WEBHOOK_ACTION.UPDATED: {
      const creatorcontent = await CreatorContent.addOrUpdateCreatorContent(data);

      if (!creatorcontent) {
        throw new Error('processCreatorContentWebhook - updated - creatorcontent not found', data.uuid);
      }
      
      const creator = await Creator.getCreatorByUuid(creatorcontent.creatorUuid);

      if (!creator) {
        console.error('processCreatorContentWebhook - updated - creator not found', creatorcontent.creatorUuid);
      }

      await Promise.allSettled([
        creator ? purgeCacheOnCdn({ type: 'creator', id: creator.uuid, shortUrl: creator.shortUrl }) : [],
        purgeCacheOnCdn({ type: 'creatorcontent', id: creatorcontent.uuid }),
      ])
      return;
    }
    case TADDY_WEBHOOK_ACTION.DELETED: {
      const deletedCreatorContent = await CreatorContent.deleteCreatorContent(data);
      const creator = await Creator.getCreatorByUuid(deletedCreatorContent.creatorUuid);

      if (!creator || !deletedCreatorContent) {
        console.error('processCreatorContentWebhook - deleted - creator or deletedCreatorContent not found', deletedCreatorContent, creator);
      }

      await Promise.allSettled([
        creator ? purgeCacheOnCdn({ type: 'creator', id: creator.uuid, shortUrl: creator.shortUrl }) : [],
        deletedCreatorContent ? purgeCacheOnCdn({ type: 'creatorcontent', id: deletedCreatorContent.uuid }) : [],
      ])
      return;
    }
    default:
      throw new Error('processCreatorContentWebhook - Invalid action');
  }
}

async function sendPushNotification(taddyType: TADDY_WEBHOOK_TYPE, action: TADDY_WEBHOOK_ACTION, data: Record<string, any>) {
  // const source = 'webhook'
  // const pushNotificationData = {
  //   source,
  //   taddyType,
  //   action,
  //   data,
  // }

  // const event = `${source}-${taddyType}-${action}`;
  // const tokenRows = await Common.getFCMTokensForEvent(event, data);
  // const fcmTokens = tokenRows.map(token => token.fcmToken)

  // await fcmSendMulticast({ fcmTokens, source, data: pushNotificationData });
}
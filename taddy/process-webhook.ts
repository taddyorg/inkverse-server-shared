import { ComicSeries, ComicIssue, Creator, CreatorContent } from '../models/index.js';
import { CacheType, purgeCacheOnCdn, purgeMultipleOnCdn } from '../cache/index.js'
import { getMultipleHeightAndWidths } from '../utils/sharp.js';

export type TaddyWebhook = {
  uuid: string;
  timestamp: number;
  taddyType: TaddyWebhookType;
  action: TaddyWebhookAction;
  data: Record<string, any>;
}

export enum TaddyWebhookType {
  COMICSERIES = "comicseries",
  COMICISSUE = "comicissue",
  CREATOR = "creator",
  CREATORCONTENT = "creatorcontent",
}

export enum TaddyWebhookAction {
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
}

export async function processWebhook(body: TaddyWebhook): Promise<void> {
  const { taddyType } = body;
  switch (taddyType) {
    case TaddyWebhookType.COMICSERIES:
      return await processComicSeriesWebhook(body);
    case TaddyWebhookType.COMICISSUE:
      return await processComicIssueWebhook(body);
    case TaddyWebhookType.CREATOR:
      return await processCreatorWebhook(body);
    case TaddyWebhookType.CREATORCONTENT:
      return await processCreatorContentWebhook(body);
    default:
      throw new Error(`processWebhook - Invalid taddyType: ${taddyType}`);
  }
}

async function processComicSeriesWebhook(body: TaddyWebhook): Promise<void> {
  const { taddyType, action, data } = body;
  switch (action) {
    case TaddyWebhookAction.CREATED: {
      const comicseries = await ComicSeries.addComicSeries(data);

      if (!comicseries) {
        throw new Error('processComicSeriesWebhook - created - comicseries not found', data.uuid);
      }

      await Promise.allSettled([
        purgeCacheOnCdn(CacheType.COMICSERIES, comicseries.uuid, comicseries.shortUrl),
        // purgeCacheOnCdn({ type: 'recentlyAdded', id: comicseries.uuid, passedInArgs: { page: 1, limitPerPage: 10 } }),
      ])
      return;
    }
    case TaddyWebhookAction.UPDATED: {
      const comicseries = await ComicSeries.updateComicSeries(data);  

      if (!comicseries) {
        throw new Error('processComicSeriesWebhook - updated - comicseries not found', data.uuid);
      }
      
      await purgeCacheOnCdn(CacheType.COMICSERIES, comicseries.uuid, comicseries.shortUrl)

      return;
    }
    case TaddyWebhookAction.DELETED: {
      const deletedComicSeries = await ComicSeries.deleteComicSeries(data);

      if (!deletedComicSeries) {
        throw new Error('processComicSeriesWebhook - deleted - deletedComicSeries not found', data.uuid);
      }

      const { uuid, issueUuids, storyUuids, shortUrl } = deletedComicSeries;

      await Promise.allSettled([
        purgeCacheOnCdn(CacheType.COMICSERIES, uuid, shortUrl),
        issueUuids ? purgeMultipleOnCdn(CacheType.COMICISSUE, issueUuids) : [],
        storyUuids ? purgeMultipleOnCdn(CacheType.COMICSTORY, storyUuids) : [],
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
    case TaddyWebhookAction.CREATED: {
      const [comicissue, comicstories] = await ComicIssue.addComicIssue(data);

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
        comicseries ? purgeCacheOnCdn(CacheType.COMICSERIES, comicseries.uuid, comicseries.shortUrl) : [],
        purgeCacheOnCdn(CacheType.COMICISSUE, comicissue.uuid),
        comicstories.length > 0 ? purgeMultipleOnCdn(CacheType.COMICSTORY, comicstories.map(story => story.uuid)) : [],
        // purgeCacheOnCdn({ type: 'recentlyUpdated', id: comicseries.uuid, passedInArgs: { page: 1, limitPerPage: 10 } }),
      ])

      // push notification
      await sendPushNotification(taddyType, action, data);

      return;
    }
    case TaddyWebhookAction.UPDATED: {
      const [comicissue, comicstories] = await ComicIssue.updateComicIssue(data);
      
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
        comicseries ? purgeCacheOnCdn(CacheType.COMICSERIES, comicseries.uuid, comicseries.shortUrl) : [],
        purgeCacheOnCdn(CacheType.COMICISSUE, comicissue.uuid),
        comicstories.length > 0 ? purgeMultipleOnCdn(CacheType.COMICSTORY, comicstories.map(story => story.uuid)) : [],
      ])

      return;
    }
    case TaddyWebhookAction.DELETED: {
      const deletedComicIssue = await ComicIssue.deleteComicIssue(data);

      if (!deletedComicIssue) {
        throw new Error('processComicIssueWebhook - deleted - deletedComicIssue not found', data.uuid);
      }

      const { uuid, storyUuids, seriesUuid } = deletedComicIssue;

      const comicseries = await ComicSeries.getComicSeriesByUuid(seriesUuid);

      if (!comicseries) {
        console.error('processComicIssueWebhook - deleted - comicseries not found', seriesUuid);
      }

      await Promise.allSettled([
        comicseries ? purgeCacheOnCdn(CacheType.COMICSERIES, comicseries.uuid, comicseries.shortUrl) : [],
        purgeCacheOnCdn(CacheType.COMICISSUE, uuid),
        storyUuids ? purgeMultipleOnCdn(CacheType.COMICSTORY, storyUuids) : [],
      ])
      return;
    }
    default:
      throw new Error('processComicIssueWebhook - Invalid action');
  }
}

async function processCreatorWebhook(body: TaddyWebhook): Promise<void> {
  const { taddyType, action, data } = body;
  switch (action) {
    case TaddyWebhookAction.CREATED: {
      const creator = await Creator.addCreator(data);

      if (!creator) {
        throw new Error('processCreatorWebhook - created - creator not found', data.uuid);
      }

      await purgeCacheOnCdn(CacheType.CREATOR, creator.uuid)
      return;
    }
    case TaddyWebhookAction.UPDATED: {
      const creator = await Creator.updateCreator(data);

      if (!creator) {
        throw new Error('processCreatorWebhook - updated - creator not found', data.uuid);
      }

      await purgeCacheOnCdn(CacheType.CREATOR, creator.uuid)
      return;
    }
    case TaddyWebhookAction.DELETED: {
      const deletedCreator = await Creator.deleteCreator(data);

      if (!deletedCreator) {
        throw new Error('processCreatorWebhook - deleted - creatorUuid not found', data.uuid );
      }

      const { uuid, contentUuids, shortUrl } = deletedCreator;

      await Promise.allSettled([
        purgeCacheOnCdn(CacheType.CREATOR, uuid, shortUrl),
        contentUuids ? purgeMultipleOnCdn(CacheType.CREATOR_CONTENT, contentUuids) : [],
      ])
      return;
    }
    default:
      throw new Error('processCreatorWebhook - Invalid action');
  }
}

async function processCreatorContentWebhook(body: TaddyWebhook): Promise<void> {
  const { taddyType, action, data } = body;
  switch (action) {
    case TaddyWebhookAction.CREATED: {
      const creatorcontent = await CreatorContent.addOrUpdateCreatorContent(data);

      if (!creatorcontent) {
        throw new Error('processCreatorContentWebhook - created - creatorcontent not found', data.uuid);
      }
      
      const creator = await Creator.getCreatorByUuid(creatorcontent.creatorUuid);

      if (!creator) {
        console.error('processCreatorContentWebhook - created - creator not found', creatorcontent.creatorUuid);
      }

      await Promise.allSettled([
        creator ? purgeCacheOnCdn(CacheType.CREATOR, creator.uuid, creator.shortUrl) : [],
        purgeCacheOnCdn(CacheType.CREATOR_CONTENT, creatorcontent.uuid),
      ])
      
      // push notification
      await sendPushNotification(taddyType, action, data);

      return;
    }
    case TaddyWebhookAction.UPDATED: {
      const creatorcontent = await CreatorContent.addOrUpdateCreatorContent(data);

      if (!creatorcontent) {
        throw new Error('processCreatorContentWebhook - updated - creatorcontent not found', data.uuid);
      }
      
      const creator = await Creator.getCreatorByUuid(creatorcontent.creatorUuid);

      if (!creator) {
        console.error('processCreatorContentWebhook - updated - creator not found', creatorcontent.creatorUuid);
      }

      await Promise.allSettled([
        creator ? purgeCacheOnCdn(CacheType.CREATOR, creator.uuid, creator.shortUrl) : [],
        purgeCacheOnCdn(CacheType.CREATOR_CONTENT, creatorcontent.uuid),
      ])
      return;
    }
    case TaddyWebhookAction.DELETED: {
      const deletedCreatorContent = await CreatorContent.deleteCreatorContent(data);

      if (!deletedCreatorContent) {
        throw new Error('processCreatorContentWebhook - deleted - deletedCreatorContent not found', data.uuid);
      }

      const creator = await Creator.getCreatorByUuid(deletedCreatorContent.creatorUuid);

      if (!creator) {
        console.error('processCreatorContentWebhook - deleted - creator not found', deletedCreatorContent.creatorUuid);
      }

      await Promise.allSettled([
        creator ? purgeCacheOnCdn(CacheType.CREATOR, creator.uuid, creator.shortUrl) : [],
        deletedCreatorContent ? purgeCacheOnCdn(CacheType.CREATOR_CONTENT, deletedCreatorContent.uuid) : [],
      ])
      return;
    }
    default:
      throw new Error('processCreatorContentWebhook - Invalid action');
  }
}

async function sendPushNotification(taddyType: TaddyWebhookType, action: TaddyWebhookAction, data: Record<string, any>) {
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
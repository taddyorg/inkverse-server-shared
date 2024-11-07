import { ComicSeries, ComicIssue, Creator, CreatorContent } from '../models/index.js';
import { purgeCacheOnCdn, purgeMultipleOnCdn } from '../cache/index.js';
import { getMultipleHeightAndWidths } from '../utils/sharp.js';
import { fcmSendMulticast } from '../firebase/index.js';

export async function processWebhook(body: Record<string, any>) {
  const { taddyType, action } = body;
  switch (taddyType) {
    case 'comicseries':
      return await processComicSeriesWebhook(body);
    case 'comicissue':
      return await processComicIssueWebhook(body);
    case 'creator':
      return await processCreatorWebhook(body);
    case 'creatorcontent':
      return await processCreatorContentWebhook(body);
    default:
      throw new Error(`processWebhook - Invalid taddyType: ${taddyType}`);
  }
}

async function processComicSeriesWebhook(body: Record<string, any>) {
  const { taddyType, action, data } = body;
  switch (action) {
    case 'created': {
      const comicseries = await ComicSeries.addComicSeries({ data });

      if (!comicseries) {
        throw new Error('processComicSeriesWebhook - created - comicseries not found', data.uuid);
      }

      await Promise.allSettled([
        purgeCacheOnCdn({ type: taddyType, id: comicseries.uuid, shortUrl: comicseries.shortUrl }),
        purgeCacheOnCdn({ type: 'recentlyAdded', id: comicseries.uuid, passedInArgs: { page: 1, limitPerPage: 10 } }),
      ])
      return;
    }
    case 'updated': {
      const comicseries = await ComicSeries.updateComicSeries(data);  

      if (!comicseries) {
        throw new Error('processComicSeriesWebhook - updated - comicseries not found', data.uuid);
      }
      
      await purgeCacheOnCdn({ type: taddyType, id: comicseries.uuid, shortUrl: comicseries.shortUrl })

      return;
    }
    case 'deleted': {
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

async function processComicIssueWebhook(body: Record<string, any>) {
  const { taddyType, action, data } = body;
  switch (action) {
    case 'created': {
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
        purgeCacheOnCdn({ type: 'recentlyUpdated', id: comicseries.uuid, passedInArgs: { page: 1, limitPerPage: 10 } }),
      ])

      // push notification
      await sendPushNotification(taddyType, action, data);

      return;
    }
    case 'updated': {
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
    case 'deleted': {
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

async function processCreatorWebhook(body: Record<string, any>) {
  const { taddyType, action, data } = body;
  switch (action) {
    case 'created': {
      const creator = await Creator.addCreator({ data });

      if (!creator) {
        throw new Error('processCreatorWebhook - created - creator not found', data.uuid);
      }

      await purgeCacheOnCdn({ type: taddyType, id: creator.uuid })
      return;
    }
    case 'updated': {
      const creator = await Creator.updateCreator({ data });

      if (!creator) {
        throw new Error('processCreatorWebhook - updated - creator not found', data.uuid);
      }

      await purgeCacheOnCdn({ type: taddyType, id: creator.uuid })
      return;
    }
    case 'deleted': {
      const { uuids, shortUrl } = await Creator.deleteCreator({ data });
      const [creatorUuid, allContentUUids] = uuids;
      const mergedUuids = allContentUUids.map(uuid => `${creatorUuid}:${uuid}`);

      if (!creatorUuid) {
        throw new Error('processCreatorWebhook - deleted - creatorUuid not found', data.uuid );
      }

      await Promise.allSettled([
        purgeCacheOnCdn({ type: 'creator', id: creatorUuid, shortUrl }),
        mergedUuids.length > 0 ? purgeMultipleOnCdn({ type: 'creatorcontent', ids: mergedUuids }) : [],
      ])
      return;
    }
    default:
      throw new Error('processCreatorWebhook - Invalid action');
  }
}

async function processCreatorContentWebhook(body: Record<string, any>) {
  const { taddyType, action, data } = body;
  switch (action) {
    case 'created': {
      const creatorcontent = await CreatorContent.addCreatorContent({ data });

      if (!creatorcontent) {
        throw new Error('processCreatorContentWebhook - created - creatorcontent not found', data.uuid);
      }
      
      const creator = await Creator.getCreatorByUuid({ uuid: creatorcontent.creatorUuid });

      if (!creator) {
        console.error('processCreatorContentWebhook - created - creator not found', creatorcontent.creatorUuid);
      }

      const mergedUuid = `${creator.uuid}:${creatorcontent.uuid}`;

      await Promise.allSettled([
        creator ? purgeCacheOnCdn({ type: 'creator', id: creator.uuid, shortUrl: creator.shortUrl }) : [],
        purgeCacheOnCdn({ type: 'creatorcontent', id: mergedUuid }),
      ])
      
      // push notification
      await sendPushNotification({ taddyType, action, data });

      return;
    }
    case 'updated': {
      const creatorcontent = await CreatorContent.updateCreatorContent({ data });

      if (!creatorcontent) {
        throw new Error('processCreatorContentWebhook - updated - creatorcontent not found', data.uuid);
      }
      
      const creator = await Creator.getCreatorByUuid({ uuid: creatorcontent.creatorUuid });

      if (!creator) {
        console.error('processCreatorContentWebhook - updated - creator not found', creatorcontent.creatorUuid);
      }

      const mergedUuid = `${creator.uuid}:${creatorcontent.uuid}`;

      await Promise.allSettled([
        creator ? purgeCacheOnCdn({ type: 'creator', id: creator.uuid, shortUrl: creator.shortUrl }) : [],
        purgeCacheOnCdn({ type: 'creatorcontent', id: mergedUuid }),
      ])
      return;
    }
    case 'deleted': {
      const { uuid, creatorUuid } = await CreatorContent.deleteCreatorContent({ data });
      const creator = await Creator.getCreatorByUuid({ uuid: creatorUuid });

      if (!creator) {
        console.error('processCreatorContentWebhook - deleted - creator not found', creatorUuid);
      }

      const mergedUuid = `${creator.uuid}:${uuid}`;
      await Promise.allSettled([
        creator ? purgeCacheOnCdn({ type: 'creator', id: creator.uuid, shortUrl: creator.shortUrl }) : [],
        purgeCacheOnCdn({ type: 'creatorcontent', id: mergedUuid }),
      ])
      return;
    }
    default:
      throw new Error('processCreatorContentWebhook - Invalid action');
  }
}

async function sendPushNotification(taddyType: string, action: string, data: Record<string, any>) {
  const source = 'webhook'
  const pushNotificationData = {
    source,
    taddyType,
    action,
    data,
  }

  const event = `${source}-${taddyType}-${action}`;
  const tokenRows = await Common.getFCMTokensForEvent({ event, data });
  const fcmTokens = tokenRows.map(token => token.fcmToken)

  await fcmSendMulticast({ fcmTokens, source, data: pushNotificationData });
}
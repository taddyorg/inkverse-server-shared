import { get } from "lodash";

import { database, type ComicSeriesModel } from "../database/index.js";
import { TaddyType } from "../graphql/types.js";
import { UUIDLookup } from "./index.js";

import { safeSeriesStatus } from "../../public/status.js";
import { safeGenresArray } from "../../public/genres.js";
import { safeLanguage } from "../../public/language.js";
import { safeContentRating } from "../../public/ratings.js";
import { safeSeriesType } from "../../public/series-type.js";
import { safeLayoutType } from "../../public/layout.js";
import { safeStringValue, safeObjWithVariantKeys, safeArrayProperties, prettyEncodeTitle, convertTextToBoolean } from "../utils/common.js";

type ComicSeriesInput = Omit<ComicSeriesModel, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>;

function getSeriesDetails(data: Record<string, any>, shortUrl: string): ComicSeriesInput {
  const name = safeStringValue(get(data, 'name', null));
  const description = safeStringValue(get(data, 'description', null), 1000);
  const hash = safeStringValue(get(data, 'hash', null), 255);
  const issuesHash = safeStringValue(get(data, 'issuesHash', null), 255);
  const datePublished = get(data, 'datePublished', null);
  const status = safeSeriesStatus(get(data, 'status', null))
  const tags = safeArrayProperties(get(data, 'tags', null), 255);
  const genres = safeGenresArray(get(data, 'genres', null));
  const genre0 = get(genres, '0', null);
  const genre1 = get(genres, '1', null);
  const genre2 = get(genres, '2', null);
  const coverImageAsString = safeStringValue(get(data, 'coverImageAsString', null), 5000);
  const bannerImageAsString = safeStringValue(get(data, 'bannerImageAsString', null), 5000);
  const thumbnailImageAsString = safeStringValue(get(data, 'thumbnailImageAsString', null), 5000);
  const coverImage = safeObjWithVariantKeys(coverImageAsString, ['base_url', 'cover_sm', 'cover_md', 'cover_lg']);
  const bannerImage = safeObjWithVariantKeys(bannerImageAsString, ['base_url', 'banner_sm', 'banner_md', 'banner_lg']);
  const thumbnailImage = safeObjWithVariantKeys(thumbnailImageAsString, ['base_url', 'thumbnail']);
  const language = safeLanguage(get(data, 'language', null));
  const contentRating = safeContentRating(get(data, 'contentRating', null));
  const seriesType = safeSeriesType(get(data, 'seriesType', null));
  const seriesLayout = safeLayoutType(get(data, 'seriesLayout', null));
  const copyright = safeStringValue(get(data, 'copyright', null), 2000);
  const sssUrl = safeStringValue(get(data, 'sssUrl', null), 2000) as string;
  const sssOwnerName = safeStringValue(get(data, 'sssOwnerName', null));
  const sssOwnerPublicEmail = safeStringValue(get(data, 'sssOwnerPublicEmail', null), 1000);
  const isBlocked = convertTextToBoolean(get(data, 'isBlocked', null));
  const hostingProviderUuid = data?.hostingProvider?.uuid || null;
  const scopesForExclusiveContent = safeArrayProperties(get(data, 'scopesForExclusiveContent', null), 1000);

  return {
    name,
    description,
    shortUrl,
    hash,
    issuesHash,
    datePublished,
    status,
    tags,
    genre0,
    genre1,
    genre2,
    coverImage,
    bannerImage,
    thumbnailImage,
    language,
    contentRating,
    seriesType,
    seriesLayout,
    copyright,
    sssUrl,
    sssOwnerName,
    sssOwnerPublicEmail,
    isBlocked,
    hostingProviderUuid,
    scopesForExclusiveContent,
  }
}

export class ComicSeries {
  static async getComicSeriesByUuid(uuid: string): Promise<ComicSeriesModel | null> {
    return await database('comicseries')
      .where({ uuid })
      .first();
  }

  static async getByShortUrl(shortUrl: string): Promise<ComicSeriesModel | null> {
    return await database('comicseries')
      .where({ shortUrl })
      .first();
  }

  static async getShortUrl(uuid: string, name: string): Promise<string> {
    const savedcomicseries = await ComicSeries.getComicSeriesByUuid(uuid);
    if (savedcomicseries && savedcomicseries.shortUrl) {
      return savedcomicseries.shortUrl
    } else {
      if (!name) { throw new Error('comicseries - getShortUrl - name is required') };
      const nameLowercase = name.toLowerCase();
      const shortUrl = prettyEncodeTitle(nameLowercase);
      const formattedShortUrl = `^${shortUrl}($|[0-9]+)`;
      const comicseries = await database('comicseries')
        .whereRaw("short_url ~ ? AND (short_url !~ '[0-9]$' OR short_url ~ '[0-9]+$')", [formattedShortUrl])
        .returning("*");

      return comicseries.length > 0
        ? `${shortUrl}-${comicseries.length}`
        : shortUrl;
    }
  }

  static async getIssueCount(uuid: string): Promise<number> {    
    const [issueCount] = await database('comicissue')
      .where({ series_uuid: uuid })
      .count('uuid', { as: 'issueCount' })
      .returning('issueCount');

    if (!issueCount) { return 0 }

    return issueCount.issueCount ? Number(issueCount.issueCount) : 0;
  }

  static async addComicSeries(data: Record<string, any>): Promise<ComicSeriesModel | null> {
    const { uuid, name } = data;
    var trx = await database.transaction();
    try {
      const shortUrl = await ComicSeries.getShortUrl(uuid, name);
      await UUIDLookup.saveUUIDforType(trx, uuid, TaddyType.Comicseries);
      const [comicseries] = await database("comicseries")
        .transacting(trx)
        .insert({
          uuid,
          ...getSeriesDetails(data, shortUrl)
        })
        .returning("*");

      await trx.commit();

      return comicseries;
    }
    catch (e) {
      console.log('addComicSeries transaction rollback', uuid, e);
      await trx.rollback();
      throw e;
    }
  }

  static async updateComicSeries(data: Record<string, any>): Promise<ComicSeriesModel | null> {
    const { uuid, name } = data;
    var trx = await database.transaction();
    try {
      const shortUrl = await ComicSeries.getShortUrl(uuid, name);
      const [comicseries] = await database("comicseries")
        .transacting(trx)
        .where({ uuid })
        .update({
          updatedAt: new Date(),
          ...getSeriesDetails(data, shortUrl)
        })
        .returning("*");

      await trx.commit();

      return comicseries;
    }
    catch (e) {
      console.log('updateComicSeries transaction rollback', uuid, e);
      await trx.rollback();
      throw e;
    }
  }

  static async deleteComicSeries(data: Record<string, any>): Promise<{ uuids: string[], shortUrl: string } | null> {
    const { uuid } = data;
    var trx = await database.transaction();

    try {
      const [deletedComicSeries] = await database('comicseries')
        .transacting(trx)
        .where({ uuid })
        .delete('*');

      const deletedComicIssues = await database('comicissue')
        .transacting(trx)
        .where({ seriesUuid: uuid })
        .delete('*');

      const deletedComicStories = await database('comicstory')
        .transacting(trx)
        .where({ seriesUuid: uuid })
        .delete('*');

      const allIssuesUUids = deletedComicIssues.map(issue => issue.uuid);
      const allStoriesUUids = deletedComicStories.map(story => story.uuid);
      const allNonStoryUuids = [uuid, ...allIssuesUUids];

      await UUIDLookup.deleteLookupsForUuids(trx, allNonStoryUuids);

      await trx.commit();

      return {
        uuids: [uuid, allIssuesUUids, allStoriesUUids],
        shortUrl: deletedComicSeries.shortUrl
      };
    }
    catch (e) {
      console.log('deleteComicSeries transaction rollback', uuid, e);
      await trx.rollback();
      throw e;
    }
  }
}
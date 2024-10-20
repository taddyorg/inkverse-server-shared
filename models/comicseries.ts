import type { UUID } from "crypto";
import database from "../database/index.js";
import type { ComicSeriesModel } from "../database/types.js";

export const getComicSeriesByUuid = async (
  uuid: UUID
): Promise<ComicSeriesModel | null> => {
  return await database('comicseries')
    .where({ uuid })
    .first();
}

export const getComicSeriesByShortUrl = async (
  shortUrl: string
): Promise<ComicSeriesModel | null> => {
  return await database('comicseries')
    .where({ shortUrl })
    .first();
}

export const getIssueCount = async (
  uuid: UUID
): Promise<number> => {
  if (!uuid) { throw new Error('comicseries - getIssueCount - uuid is required') }
  const [issueCount] = await database('comicissue')
    .where({ series_uuid: uuid })
    .count('uuid', { as: 'issueCount' })
    .returning('issueCount');

  if (!issueCount) { return 0 }

  return issueCount.issueCount ? Number(issueCount.issueCount) : 0;
}
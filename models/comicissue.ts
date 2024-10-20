import type { UUID } from "crypto";
import database from "../database/index.js";
import { SortOrder } from "../graphql/types.js";
import type { ComicIssueModel } from "../database/types.js";
import { sortOrderToSQLOrderBy } from "./utils.js";

export const getComicIssueByUuid = async (
  uuid: UUID
): Promise<ComicIssueModel | null> => {
  return await database('comicissue')
    .where({ uuid })
    .first();
}

export const getComicIssuesByUuids = async (
  uuids: UUID[],
  limit: number | undefined = 25
): Promise<ComicIssueModel[]> => {
  return await database('comicissue')
    .whereIn('uuid', uuids)
    .limit(limit);
}

export const getComicIssueForSeries = async (
  seriesUuid: UUID,
  sortOrder: SortOrder | undefined = SortOrder.Oldest
): Promise<ComicIssueModel | null> => {
  return await database.select([
      'comicissue.*',
    ])
    .from('comicseries').rightJoin('comicissue', 'comicseries.uuid', 'comicissue.series_uuid')
    .whereRaw('comicseries.uuid = ?', [seriesUuid])
    .orderBy('comicissue.position', sortOrderToSQLOrderBy(sortOrder))
    .first();
}

export const getIssuesForComicSeries = async (
  seriesUuid: UUID,
  sortOrder: SortOrder | undefined = SortOrder.Latest,
  limit: number | undefined = 10,
  offset: number | undefined = 0,
  includeRemovedIssues: boolean | undefined = false
): Promise<ComicIssueModel[]> => {

  return await database('comicissue')
    .where({
      seriesUuid,
    })
    .orderByRaw('position ' + sortOrderToSQLOrderBy(sortOrder) + ' NULLS LAST')
    .offset(offset)
    .limit(limit)
    .modify(function (queryBuilder) {
      if (!includeRemovedIssues) {
          queryBuilder.andWhereRaw('(is_removed IS NULL OR is_removed = false)')
      }
    })
    .returning('*');
}

export const getComicIssueForSeriesByPosition = async (
  seriesUuid: UUID,
  position: number
): Promise<ComicIssueModel | null> => {
  return await database('comicissue')
    .where({
      seriesUuid,
      position,
    })
    .first();
}
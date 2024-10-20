import type { UUID } from "crypto";
import { SortOrder } from "../graphql/types.js";
import database from "../database/index.js";
import type { CreatorContentModel } from "../database/types.js";
import { sortOrderToSQLOrderBy } from "./utils.js";

export async function getContentForCreator(
  creatorUuid: UUID,
  sortOrder: SortOrder | undefined = SortOrder.Latest,
  offset: number | undefined = 0,
  limit: number | undefined = 10
): Promise<CreatorContentModel[]> {
  return await database('creatorcontent')
    .where({
      creatorUuid,
    })
    .orderByRaw('position ' + sortOrderToSQLOrderBy(sortOrder) + ' NULLS LAST')
    .offset(offset)
    .limit(limit)
    .returning('*');
}
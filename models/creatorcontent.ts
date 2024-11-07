import { get } from "lodash-es";

import { database, type CreatorContentModel } from "../database/index.js";
import { SortOrder, TaddyType } from "../graphql/types.js";

import { sortOrderToSQLOrderBy } from "./utils.js";
import { safeStringValue, safeArrayProperties } from "../utils/common.js";
import { safeContentRole } from "../../public/roles.js";

type CreatorContentInput = Omit<CreatorContentModel, 'id' | 'createdAt' | 'updatedAt'>;

function getCreatorContentDetails(data: Record<string, any>): CreatorContentInput {
  const hash = safeStringValue(get(data, 'hash', null), 255);
  const creatorUuid = safeStringValue(get(data, 'creatorUuid', null), 255);
  const contentUuid = safeStringValue(get(data, 'contentUuid', null), 255);
  const contentType = safeStringValue(get(data, 'contentType', null), 255);
  const unfilteredRoles = safeArrayProperties(get(data, 'roles', []), 255);
  const roles = unfilteredRoles 
    ? unfilteredRoles.filter(role => safeContentRole(role)) 
    : null;
  const position = get(data, 'position', null);
  const contentPosition = get(data, 'contentPosition', null);

  if (!contentType || !creatorUuid || !contentUuid) {
    throw new Error('getCreatorContentDetails - missing required fields');
  }

  return {
    hash,
    creatorUuid,
    contentUuid,
    contentType: contentType.toUpperCase() as TaddyType,
    roles,
    position,
    contentPosition,
  }
}

export class CreatorContent {
  static async getContentForCreator(
    creatorUuid: string,
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
}
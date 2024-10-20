import type { UUID } from "crypto";
import { TaddyType } from "../graphql/types.js";
import database from "../database/index.js";
import type { CreatorModel } from "../database/types.js";

export const getCreatorByUuid = async (uuid: UUID): Promise<CreatorModel | null> => {
  return await database('creator')
    .where({ uuid })
    .first();
}

export const getCreatorByShortUrl = async (shortUrl: string): Promise<CreatorModel | null> => {
  return await database('creator')
    .where({ shortUrl })
    .first();
}

export const getCreatorsForContent = async (contentUuid: UUID, contentType: TaddyType): Promise<CreatorModel[]> => {
    return await database.select([
      'creator.*',
    ])
    .from('creator').leftJoin('creatorcontent', 'creator.uuid', 'creatorcontent.creator_uuid')
    .whereRaw('creatorcontent.content_uuid = ? AND creatorcontent.content_type = ?', [contentUuid, contentType])
    .orderByRaw('creatorcontent.content_position asc NULLS LAST')
    .returning('*');
}


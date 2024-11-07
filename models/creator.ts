import { get } from "lodash-es";

import { database, type CreatorModel } from "../database/index.js";
import { TaddyType } from "../graphql/types.js";

import { safeStringValue, safeArrayProperties, safeObjWithVariantKeys, convertTextToBoolean } from "../utils/common.js";
import { safeCountry } from "../../public/country.js";
import { safeLinkType } from "../../public/links.js";

type CreatorInput = Omit<CreatorModel, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>;

function getCreatorDetails(data: Record<string, any>, shortUrl: string): CreatorInput {
  const name = safeStringValue(get(data, 'name', null));
  const bio = safeStringValue(get(data, 'bio', null), 1000);
  const hash = safeStringValue(get(data, 'hash', null), 255);
  const contentHash = safeStringValue(get(data, 'contentHash', null), 255);
  const datePublished = get(data, 'datePublished', null);
  const avatarImageAsString = safeStringValue(get(data, 'avatarImageAsString', null), 5000);
  const avatarImage = safeObjWithVariantKeys(avatarImageAsString, ['base_url', 'avatar_sm', 'avatar_md', 'avatar_lg']);
  const country = safeCountry(get(data, 'country', null));
  const tags = safeArrayProperties(get(data, 'tags', null), 255);
  const linksAsString = safeStringValue(get(data, 'linksAsString', null), 5000);
  const links = linksAsString 
    ? (JSON.parse(linksAsString) || []).filter((link: Record<string, string>) => safeLinkType(link.type)) 
    : null;
  const copyright = safeStringValue(get(data, 'copyright', null), 2000);
  const sssUrl = safeStringValue(get(data, 'sssUrl', null), 2000);
  const sssOwnerName = safeStringValue(get(data, 'sssOwnerName', null));
  const sssOwnerPublicEmail = safeStringValue(get(data, 'sssOwnerPublicEmail', null), 1000);
  const isBlocked = convertTextToBoolean(get(data, 'isBlocked', null));

  return {
    name,
    bio,
    shortUrl,
    hash,
    contentHash,
    datePublished,
    avatarImage,
    country,
    tags,
    links,
    copyright,
    sssUrl,
    sssOwnerName,
    sssOwnerPublicEmail,
    isBlocked,
  }
}

export class Creator {
  static async getCreatorByUuid(uuid: string): Promise<CreatorModel | null> {
    return await database('creator')
      .where({ uuid })
      .first();
  }

  static async getCreatorByShortUrl(shortUrl: string): Promise<CreatorModel | null> {
    return await database('creator')
      .where({ shortUrl })
      .first();
  }

  static async getCreatorsForContent(contentUuid: string, contentType: TaddyType): Promise<CreatorModel[]> {
    return await database.select([
      'creator.*',
    ])
    .from('creator').leftJoin('creatorcontent', 'creator.uuid', 'creatorcontent.creator_uuid')
    .whereRaw('creatorcontent.content_uuid = ? AND creatorcontent.content_type = ?', [contentUuid, contentType])
    .orderByRaw('creatorcontent.content_position asc NULLS LAST')
    .returning('*');
  }
}


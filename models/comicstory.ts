import type { UUID } from "crypto";
import type { Knex } from "knex";

import database from "../database/index.js";
import type { ComicStoryModel } from "../database/types.js";

export const getComicStoryByUuid = async (
  uuid: UUID
): Promise<ComicStoryModel> => {
  return await database('comicstory')
    .where({ uuid })
    .first();
}

export const getComicStoriesForIssue = async (
  issueUuid: UUID,
  includeRemovedStories: boolean | undefined = false
): Promise<ComicStoryModel[]> => {
  return await database('comicstory')
    .where({ 
      issueUuid, 
    })
    .orderBy('position', 'asc')
    .modify(function(queryBuilder){
      if (!includeRemovedStories) {
        queryBuilder.andWhereRaw('(is_removed IS NULL OR is_removed = false)')
      }
    })
    .returning('*');
}

export const updateMultipleComicStories = async (
    trx: Knex.Transaction,
    stories: ComicStoryModel[],
    issueUuid: UUID,
    seriesUuid: UUID
): Promise<ComicStoryModel[] | undefined> => {
    const [updatedStories] =  await Promise.all(stories.map(story => 
        trx('comicstory')
        .where('uuid', story.uuid)
        .update({
            issueUuid,
            seriesUuid,
            width: story.width,
            height: story.height,
            storyImage: story.storyImage
        })
        .returning('*')
    ));

    return updatedStories;
}
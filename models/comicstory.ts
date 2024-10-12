import type { UUID } from "crypto";
import type { Knex } from "knex";
import type { ComicStory } from "../../public/models/comicstory.js";

export const updateMultipleComicStories = async (
    trx: Knex.Transaction,
    stories: ComicStory[],
    issueUuid: UUID,
    seriesUuid: UUID
): Promise<number[]> => {
    return Promise.all(stories.map(story => 
        trx('comicstory')
        .where('uuid', story.uuid)
        .update({
            issueUuid,
            seriesUuid,
            width: story.width,
            height: story.height,
            storyImage: story.storyImage
        })
    ));
}
import type { UUID } from "crypto";

export type ComicSeriesModel = {
  id?: number;
  uuid: UUID;
  createdAt: Date;
  updatedAt?: Date;
  source?: string;
  sssUrl: string;
  sssOwnerName?: string;
  sssOwnerPublicEmail?: string;
  hash?: string;
  websubHash?: string;
  issuesHash?: string;
  creatorsHash?: string;
  datePublished?: number;
  name?: string;
  description?: string;
  coverImage?: Record<string, string>;
  bannerImage?: Record<string, string>;
  thumbnailImage?: Record<string, string>;
  seriesType?: string;
  language?: string;
  contentRating?: string;
  genre0?: string;
  genre1?: string;
  genre2?: string;
  tags?: string[];
  shortUrl: string;
  copyright?: string;
  isCompleted?: boolean;
  isBlocked?: boolean;
  status?: string;
  seriesLayout?: string;
  hostingProviderUuid?: UUID;
  scopesForExclusiveContent?: string[];
}

export type ComicIssueModel = {
  id?: number;
  uuid: UUID;
  seriesUuid: UUID;
  createdAt: Date;
  updatedAt?: Date;
  hash?: string;
  storiesHash?: string;
  datePublished?: number;
  name?: string;
  creatorNote?: string;
  bannerImage?: Record<string, string>;
  thumbnailImage?: Record<string, string>;
  isRemoved?: boolean;
  isBlocked?: boolean;
  position?: number;
  pushNotificationMessage?: string;
  scopesForExclusiveContent?: string[];
  dateExclusiveContentIsAvailable?: Date;
}

export type ComicStoryModel = {
  id?: number;
  uuid: UUID;
  createdAt?: Date;
  updatedAt?: Date;
  hash?: string;
  seriesUuid: UUID;
  issueUuid: UUID;
  position?: number;
  width?: number;
  height?: number;
  storyImage?: Record<string, string>;
  isRemoved?: boolean;
}

export type CreatorModel = {
  id?: number;
  uuid: UUID;
  createdAt?: Date;
  updatedAt?: Date;
  hash?: string;
  name?: string;
  description?: string;
  avatarImage?: Record<string, string>;
  source?: string;
  contentHash?: string;
  websubHash?: string;
  datePublished?: number;
  bio?: string;
  country?: string;
  links?: any[];
  tags?: string[];
  shortUrl: string;
  copyright?: string;
  sssUrl?: string;
  sssOwnerName?: string;
  sssOwnerPublicEmail?: string;
  isBlocked?: boolean;
}

export type CreatorContentModel = {
  id?: number;
  createdAt: Date;
  updatedAt?: Date;
  hash?: string;
  contentUuid: UUID;
  contentType: string;
  creatorUuid: UUID;
  roles?: string[];
  position?: number;
  contentPosition?: number;
}
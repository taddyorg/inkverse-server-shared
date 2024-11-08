import { GraphQLClient, gql } from 'graphql-request';

export async function taddyGraphqlRequest(query: string, variables: any) {
  const endpointUrl = "https://api.taddy.org/";
    
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Inkverse shared/1.0',
    'X-USER-ID': process.env.TADDY_USER_ID,
    'X-API-KEY': process.env.TADDY_API_KEY,
  }
  
  try {
    const client = new GraphQLClient(endpointUrl, { headers })
    const data = await client.request(query, variables)
    return data;
  }catch(e) {
    console.log("inside sentTaddyGraphqlRequest", query, variables, e)
  }
}

const SEARCH_FOR_TERM_QUERY = gql`
  query searchForTerm($term: String, $page: Int, $limitPerPage: Int, $filterForTypes: [TaddyType], $filterForCountries: [Country], $filterForLanguages: [Language], $filterForGenres: [Genre], $filterForTags: [String], $filterForSeriesUuids: [ID], $filterForNotInSeriesUuids: [ID], $isExactPhraseSearchMode: Boolean, $isSafeMode: Boolean, $searchResultsBoostType: SearchResultBoostType) {
    searchForTerm(term: $term, page: $page, limitPerPage: $limitPerPage, filterForTypes: $filterForTypes, filterForCountries: $filterForCountries, filterForLanguages: $filterForLanguages, filterForGenres: $filterForGenres, filterForTags: $filterForTags, filterForSeriesUuids: $filterForSeriesUuids, filterForNotInSeriesUuids: $filterForNotInSeriesUuids, isExactPhraseSearchMode: $isExactPhraseSearchMode, isSafeMode: $isSafeMode, searchResultsBoostType:$searchResultsBoostType) {
      searchId
      comicSeries {
        uuid
      }
    }
  }
`

const GET_COMICSERIES = gql`
  query GetComicSeries($uuid: ID) {
    getComicSeries(uuid: $uuid) {
      uuid
      name
      description
      status
      hash
      issuesHash
      datePublished
      coverImageAsString
      bannerImageAsString
      thumbnailImageAsString
      tags
      genres
      language
      contentRating
      seriesType
      seriesLayout
      sssUrl
      sssOwnerName
      sssOwnerPublicEmail
      copyright
      isBlocked
      totalIssuesCount
      hostingProvider{
        uuid
        sssUrl
      }
      scopesForExclusiveContent
    }
  }
`

const GET_COMICSERIES_WITH_CREATOR = gql`
  query GetComicSeriesWithCreator($uuid: ID) {
    getComicSeries(uuid: $uuid) {
      uuid
      creators {
        uuid
        name
        bio
        hash
        contentHash
        avatarImageAsString
        tags
        country
        linksAsString
        sssUrl
        sssOwnerName
        sssOwnerPublicEmail
        copyright
        isBlocked
      }
    }
  }
`

const GET_COMICSERIES_WITH_ISSUES = gql`
  query GetComicSeriesWithIssues($uuid: ID, $page: Int, $limitPerPage: Int) {
    getComicSeries(uuid: $uuid) {
      uuid
      name
      issues(page: $page, limitPerPage: $limitPerPage) {
        uuid
      }
    }
  }
`

const GET_COMICISSUE = gql`
  query GetComicIssue($uuid: ID) {
    getComicIssue(uuid: $uuid) {
      uuid
      seriesUuid
      name
      creatorNote
      pushNotificationMessage
      hash
      storiesHash
      datePublished
      bannerImageAsString
      thumbnailImageAsString
      stories{
        uuid
        hash
        storyImageAsString
      }
      position
      scopesForExclusiveContent
      dateExclusiveContentIsAvailable
      isRemoved
      isBlocked
    }
  }
`

const GET_CREATOR = gql`
  query GetCreator($uuid: ID) {
    getCreator(uuid: $uuid) {
      uuid
      name
      bio
      hash
      contentHash
      avatarImageAsString
      tags
      country
      linksAsString
      sssUrl
      sssOwnerName
      sssOwnerPublicEmail
      copyright
      isBlocked
      totalContentCount
    }
  }
`

const GET_CREATOR_WITH_CONTENT = gql`
  query GetCreatorWithContent($uuid: ID, $page: Int) {
    getCreator(uuid: $uuid) {
      uuid
      name
      content(page: $page) {
        uuid
      }
    }
  }
`

const GET_CREATORCONTENT = gql`
  query GetCreatorContent($uuid: ID) {
    getCreatorContent(uuid: $uuid) {
      uuid
      hash
      creatorUuid
      contentUuid
      contentType
      roles
      position
      contentPosition
    }
  }
`
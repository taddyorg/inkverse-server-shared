import type { CodegenConfig } from '@graphql-codegen/cli';

const SERVER_URL = process.env.NODE_ENV === 'production'  
  ? "https://api-v2.inkverse.co"
  : "http://inkverse.test:3010/api/graphql";

const config: CodegenConfig = {
  overwrite: true,
  schema: SERVER_URL,
  generates: {
    "src/shared/graphql/types.ts": {
      config: {
        mappers: {
          ComicSeries: "../database/types.js#ComicSeriesModel",
          ComicIssue: "../database/types.js#ComicIssueModel",
          ComicStory: "../database/types.js#ComicStoryModel",
          Creator: "../database/types.js#CreatorModel",
          CreatorContent: "../database/types.js#CreatorContentModel",
        },
        useIndexSignature: true,
        useTypeImports: true,
        namingConvention: {
          enumValues: 'upper-case#upperCase'
        }
      },
      plugins: ["typescript", "typescript-resolvers"]
    },
  }
};

export default config;
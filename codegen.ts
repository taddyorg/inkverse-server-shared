import type { CodegenConfig } from '@graphql-codegen/cli';

const schema = process.env.NODE_ENV !== 'production' 
  ? "http://localhost:3010/api/graphql" 
  : "https://api-v1.inkverse.co";

const config: CodegenConfig = {
  overwrite: true,
  schema,
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
      },
      plugins: ["typescript", "typescript-resolvers"]
    },
  }
};

export default config;
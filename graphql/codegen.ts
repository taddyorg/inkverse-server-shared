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
declare module 'knex-stringcase' {
  import { Knex } from 'knex';
  function knexStringcase(config: Knex.Config): Knex.Config;
  export default knexStringcase;
}

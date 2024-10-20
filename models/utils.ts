import { SortOrder } from "../graphql/types.js";

export function sortOrderToSQLOrderBy(sortOrder: SortOrder | undefined): string {
  switch (sortOrder) {
    case SortOrder.Oldest:
      return 'asc';
    default:
      return 'desc';
  }
}
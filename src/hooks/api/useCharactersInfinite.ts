import { UseInfiniteQueryOptions, useInfiniteQuery } from "react-query";
import { rickAndMortyService } from "../../api/services/RickAndMorty.service";
import FetchError from "../../api/FetchError";
import { Info, Character } from "../../types/RickAndMortyAPI.types";
import { QueryKeys } from "../../lib/react-query/queries";

type UseInfiniteCharacterQueryOptions = Omit<
  UseInfiniteQueryOptions<Info<Character[]> | null | undefined, Error>,
  "queryFn" | "queryKey" | "queryHash" | "queryKeyHashFn"
>;

const useCharacterInfiniteQuery = (
  filter: string,
  observerOptions?: UseInfiniteCharacterQueryOptions
) => {
  return useInfiniteQuery<Info<Character[]> | null | undefined, Error>({
    queryKey: [QueryKeys.Characters, filter],
    queryFn: ({ pageParam, signal }) => {
      return rickAndMortyService
        .getCharacters(
          {
            page: pageParam,
            name: filter,
          },
          signal
        )
        .catch((e) => {
          // Not found error occurred, return null to finish infiniteQuery, otherwise pop error up
          if (e instanceof FetchError && e.getStatusCode() === 404) {
            return null;
          }
          throw e;
        });
    },
    getNextPageParam: (lastPage) =>
      rickAndMortyService.getNextPageParamAccordingNextPage(
        lastPage?.info?.next
      ),
    ...observerOptions,
  });
};

export default useCharacterInfiniteQuery;

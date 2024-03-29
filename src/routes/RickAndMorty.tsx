import { useMemo, useState } from "react";
import useDebouncedValue from "../hooks/useDebouncedValue";
import CharacterCard from "../components/RickAndMorty/CharacterCard";
import "../styles/sass/routes/RickAndMorty.scss";
import { Character } from "../types/RickAndMortyAPI.types";
import { Autocomplete, TextField } from "@mui/material";
import { textFieldStyles } from "../styles/mui/shared/TextField.styles";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useCharacterInfiniteQuery from "../hooks/api/useCharactersInfinite";

const DISABLED_OPTION_KEY = Number.MIN_SAFE_INTEGER;

type CharacterOption = Pick<Character, "id" | "name">;
const RickAndMorty: React.FC = () => {
  const [filterText, setFilterText] = useState("");
  const [characterOptions, setCharacterOptions] = useState<Character[]>([]);

  const filter = useDebouncedValue(filterText, 300) ?? "";

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useCharacterInfiniteQuery(filter, {
      onSuccess(data) {
        if (!data) return;

        const unionUniqueCharacters = new Map<Character["id"], Character>();
        data.pages.forEach((p) =>
          p?.results?.forEach((r) => unionUniqueCharacters.set(r.id, r))
        );

        setCharacterOptions((prev) => {
          prev.forEach(
            (char) =>
              // Checking first if has in order to not override fresh character record fetched from api,
              // as it is in any case newer than existing record if has
              !unionUniqueCharacters.has(char.id) &&
              unionUniqueCharacters.set(char.id, char)
          );
          return [...unionUniqueCharacters.values()].sort((char, secChar) =>
            char.name.localeCompare(secChar.name)
          );
        });
      },
      onError(e) {
        console.error(e);
        alert("Error occurred");
      },
      retry: false,
      staleTime: Infinity,
    });

  const [elementToObserveRef, isWithInfiniteScroll] =
    useInfiniteScroll<HTMLElement>(fetchNextPage, !!hasNextPage);

  const characters: Character[] = useMemo(
    () => data?.pages.flatMap((d) => d?.results ?? []) ?? [],
    [data]
  );

  let footer;
  if (isLoading || isFetchingNextPage) footer = <div>Loading...</div>;
  else if (hasNextPage) {
    if (!isWithInfiniteScroll)
      footer = <button onClick={() => fetchNextPage()}>next</button>;
  } else footer = <div>No more results</div>;

  return (
    <div className="rick-morty__container">
      <header className="rick-morty__container__header">
        <Autocomplete
          freeSolo
          renderInput={(params) => (
            <TextField {...params} sx={textFieldStyles.primary} />
          )}
          getOptionDisabled={(option) => option.id === DISABLED_OPTION_KEY}
          options={[
            ...characterOptions,
            ...(hasNextPage
              ? [
                  {
                    id: DISABLED_OPTION_KEY,
                    name: "For more results be more specific...",
                  } as CharacterOption,
                ]
              : []),
          ]}
          getOptionLabel={(char) =>
            typeof char === "string" ? char : char?.name
          }
          getOptionKey={(char) => (typeof char === "string" ? char : char?.id)}
          onInputChange={(_, value) => setFilterText(value)}
        />
      </header>
      <ul className="rick-morty__container__characters">
        {characters.map((character) => (
          <li key={character.id}>
            <CharacterCard
              id={character.id}
              image={character.image}
              name={character.name}
              numOfEpisode={character.episode.length}
              status={character.status}
            />
          </li>
        ))}
      </ul>
      <footer
        className="rick-morty__container__footer"
        ref={elementToObserveRef}
      >
        {footer}
      </footer>
    </div>
  );
};

export default RickAndMorty;

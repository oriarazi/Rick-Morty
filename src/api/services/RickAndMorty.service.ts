import { loggedUser } from "../../mockData";
import {
  Info,
  Character,
  CharacterFilter,
  FullCharacter,
} from "../../types/RickAndMortyAPI.types";
import { getParamViaFullUrl } from "../../utils/URLSearchParams.utils";
import { isAdmin } from "../../utils/auth.utils";
import FetchError from "../FetchError";

const CHARACTERS_PATH = "/character";

const RICK_MORTY_API_PATH = import.meta.env.VITE_RICK_AND_MORTY_API_BASE_URL;
if (!RICK_MORTY_API_PATH) throw new Error("missing env variable");

abstract class RickAndMortyFetcher {
  protected apiBaseUrl = RICK_MORTY_API_PATH;
  protected charactersApiPath = this.apiBaseUrl + CHARACTERS_PATH;

  protected abstract fetchCharacters(
    filters: CharacterFilter,
    signal?: AbortSignal | null
  ): Promise<Info<FullCharacter[]>>;

  async getCharacters(
    filters: CharacterFilter,
    signal?: AbortSignal | null
  ): Promise<Info<Character[]>> {
    // Fake authorization check force
    if (!loggedUser) throw new FetchError(401, "Protected resource");

    const fullyCharacters = await this.fetchCharacters(filters, signal);
    const classifiedKeys = this.getAdminOnlyKeys();

    // Sanitizing data
    const minifiedCharacters: Info<Character[]> = {
      info: fullyCharacters.info,
    };

    if (fullyCharacters.results) {
      minifiedCharacters.results = fullyCharacters.results.map((fullyChar) => {
        const char: Character = {
          episode: fullyChar.episode,
          id: fullyChar.id,
          image: fullyChar.image,
          name: fullyChar.name,
          status: fullyChar.status,
        };

        // Remove admin-only keys if user is non-admin
        if (!isAdmin(loggedUser!)) {
          classifiedKeys.forEach((key) => delete char[key]);
        }

        return char;
      });
    }

    return minifiedCharacters;
  }

  protected getAdminOnlyKeys(): [keyof Character] {
    return ["status"];
  }

  getNextPageParamAccordingNextPage(
    nextUrl?: string | null
  ): undefined | string {
    if (!nextUrl) return undefined;

    const pageParamKey: keyof CharacterFilter = "page";
    return getParamViaFullUrl(pageParamKey, nextUrl);
  }
}

const INITIAL_PAGE_NUMBER = 1;

class RickAndMortyFetchAPIService extends RickAndMortyFetcher {
  protected async fetchCharacters(
    { page = INITIAL_PAGE_NUMBER, ...restFilters }: CharacterFilter,
    signal: AbortSignal | null
  ): Promise<Info<FullCharacter[]>> {
    const params = new URLSearchParams({
      page: String(page),
      ...Object.fromEntries(
        Object.entries(restFilters).filter(([, value]) => Boolean(value))
      ),
    });

    const response = await fetch(`${this.charactersApiPath}?${params}`, {
      signal,
    });
    if (!response.ok) {
      throw new FetchError(response.status, response.statusText);
    }

    return await response.json();
  }
}

// SINGLETON
export const rickAndMortyService = new RickAndMortyFetchAPIService();

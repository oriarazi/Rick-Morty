import { Character } from "../../types/RickAndMortyAPI.types";
import "../../../src/styles/sass/components/RickAndMorty/CharacterCard.scss";
import ImageWithFallback from "../utils/ImageWithFallback";
import { useUser } from "../../context/AuthContext";
import { isAdmin } from "../../utils/auth.utils";
import { forwardRef } from "react";

export interface ICharacterCard extends Omit<Character, "episode"> {
  numOfEpisode: number;
}

const CharacterCard = forwardRef<HTMLDivElement, ICharacterCard>(
  (props, ref) => {
    const { user } = useUser();

    return (
      <div
        className="character__card"
        {...(isAdmin(user!) ? { ["character-status"]: props.status } : {})}
        ref={ref}
      >
        <ImageWithFallback
          className="character__card__photo"
          src={props.image}
          alt="chara-logo"
          onError={() => {
            /** Replace src to unknown logo, otherwise fallback will take place also in error */
          }}
        />
        <h2 className="character__card__title" title={props.name}>
          {props.name}
        </h2>
      </div>
    );
  }
);

export default CharacterCard;

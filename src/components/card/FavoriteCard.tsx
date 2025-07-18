import { memo } from "react";
import { useFavoriteListStore } from "../../stores/favoriteList.store";

interface FavoriteCardProps {
  cardImg: string;
  cardName: string;
  placeId: string;
  isNew: boolean;
}

const FavoriteCard = memo(
  ({ cardImg, cardName, placeId, isNew }: FavoriteCardProps) => {
    const deleteOldFavoriteList = useFavoriteListStore(
      (state) => state.deleteOldFavoriteList
    );
    const deleteNewFavoriteList = useFavoriteListStore(
      (state) => state.deleteNewFavoriteList
    );
    const updateDeleteList = useFavoriteListStore(
      (state) => state.updateDeleteList
    );

    const handleDeleteFavoriteList = () => {
      if (isNew) deleteNewFavoriteList(placeId);
      else {
        deleteOldFavoriteList(placeId);
        updateDeleteList({ placeId });
      }
    };

    return (
      <div
        style={{
          boxShadow: `
      inset 1px 1px 0 rgba(0, 0, 0, 0.2),
      4px 4px 10px rgba(0, 0, 0, 0.2)
    `,
        }}
        className="flex flex-col gap-[3px] p-[10px] pb-[5px] bg-white w-[157px] h-fit rounded-[4px] relative"
      >
        <button
          onClick={handleDeleteFavoriteList}
          className="absolute right-[-6px] top-[-5px]"
        >
          <img
            src="/images/close-rounded.svg"
            alt="close"
            className="text-[10px]  h-[18px] hover:cursor-pointer"
          />
        </button>
        <img
          src={cardImg}
          alt={cardName}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/default.png";
          }}
          loading="lazy"
          className="text-[12px] rounded-[4px] h-[107px] w-[137px] object-cover"
        />
        <p className="text-[14px] truncate">{cardName}</p>
      </div>
    );
  }
);

export default FavoriteCard;

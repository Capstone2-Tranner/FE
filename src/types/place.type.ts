export type PlaceId = {
  placeId: string;
};

export type Place = PlaceId & {
  placeName: string;
  placeType?: string;
  photoUrl?: string | null;
  address: string;
  latitude: number;
  longitude: number;
};

export type CountryAndRegion = {
  countryName: string;
  regionName: string;
};

export type InsertBasketDataType = CountryAndRegion & {
  places: Place[];
};

export type DeleteBasketDataType = CountryAndRegion & {
  placeId: string[];
};

export type ReadPlaceListRequestType = CountryAndRegion & {
  pageToken: string | null;
};

export type Places = PlaceId & {
  placeName: string;
  placeType?: string;
  photoUrl?: string | null;
};

export type RecentPlace = CountryAndRegion & Places;

export type ReadPlaceListResponse = {
  places: Places[];
  pageToken: string | null;
};

export type ReadPlaceDetailResponse = PlaceId & {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  summary?: string;
  openingHours?: {
    weekdayText?: string[];
  };
  phoneNumber?: string;
  url?: string;
  placeType?: string;
  photoUrl?: string | null;
};

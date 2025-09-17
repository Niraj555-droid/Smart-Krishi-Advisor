import locationDataJson from './locations.json';

export const locationData = locationDataJson;

export const parseLocation = (locationString: string) => {
  const parts = locationString.split(', ');
  return {
    district: parts[0],
    state: parts[1]
  };
};
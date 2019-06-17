const FS_LIST_API = `${process.env.REACT_APP_FS_API}`;
const FS_VENUE_API = `${process.env.REACT_APP_FS_VENUE_API}`;
const CLIENT_ID = `${process.env.REACT_APP_FS_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.REACT_APP_FS_CLIENT_SECRET}`;

export const FS_API_ERR_FALLBACK =
  'Sorry something went wrong with Foursquare API...';

// Maximum number of venues displayed
export const VENUE_COUNT = 10;

export const getVenueList = () => {
  return fetch (
    `${FS_LIST_API}&limit=${VENUE_COUNT}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323`
  )
    .then (response => response.json ())
    .then (response => {
      let fslocations = response.response.groups[0].items;
      let venues = [];
      fslocations.forEach (fsloc => {
        let loc = {};
        loc['title'] = fsloc.venue.name;
        loc['category'] = fsloc.venue.categories[0].name;
        loc['location'] = {
          lat: fsloc.venue.location.lat,
          lng: fsloc.venue.location.lng,
        };
        loc['vid'] = fsloc.venue.id;
        loc[
          'icon'
        ] = `${fsloc.venue.categories[0].icon.prefix}32${fsloc.venue.categories[0].icon.suffix}`;
        loc[
          'address'
        ] = `${fsloc.venue.location.address}, ${fsloc.venue.location.formattedAddress[1]}`;
        venues.push (loc);
      });
      return venues;
    });
};

export const getVenueDetails = location => {
  return fetch (
    `${FS_VENUE_API}${location.vid}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20180323`
  )
    .then (response => response.json ())
    .then (response => {
      if (response.meta.code === 429) {
        return Promise.reject (
          new Error ('Foursquare Free Account Quota exceeded')
        );
      } else {
        return {
          title: location.title,
          photo: `${response.response.venue.bestPhoto.prefix}300${response.response.venue.bestPhoto.suffix}`,
          tip: response.response.venue.tips.groups[0].items[0].text,
        };
      }
    });
};

export const getCategories = locations => {
  let categories = [];
  locations.forEach (loc => {
    !categories.includes (loc['category']) && categories.push (loc['category']);
  });
  return categories;
};

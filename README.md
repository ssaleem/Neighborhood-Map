# Trending in Tampa Bay
A Google Maps web application displaying Tampa Bay's top trending places. The site gives a sidebar with a list of the places that can be filtered based on their category. The location markers on map, when clicked, open an info window giving additional information about their respective places including top photo and top tip shared by visitors. The service worker offering offline-first experience is implemented in the production build.

_Foursquare API free account has limited quota for requests made in 24 hours time period, because of that Infowindow data may not be available if site is visited  multiple times_

## Responsive Design
The site is mobile-first and fully responsive. The sidebar listing all the places is hidden on smaller screens and a hamburger icon can be clicked to show or hide sidebar.

![Layout across different screens](responsive.png)

## Built with
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Create React App](https://github.com/facebookincubator/create-react-app) - Creates an environment to bootstrap React applications.
- [google-maps-react](https://www.npmjs.com/package/google-maps-react) - A declarative Google Map React component built using React.
- [Foursquare API](https://developer.foursquare.com/docs/api) - Api to incorporate Foursquare venues data as well as Photos, tips, and reviews written by Foursquare users into apps.
- [prop-types](https://www.npmjs.com/package/prop-types) - Runtime type checking for React props.
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) - An interface for fetching resources.
- [CSS Flexbox](https://www.w3schools.com/css/css3_flexbox.asp) - CSS layout module to design flexible responsive layout structure without using float or positioning.
- [CSS Media Queries](https://www.w3schools.com/css/css3_mediaqueries.asp) - A popular technique to deliver a tailored style sheet to desktops, laptops, tablets, and mobile phones by defining different style rules for different media types.

## Live Version
The live version of this app can be explored [here](https://ssaleem.github.io/Trending-in-Tampa-Bay).

## How to run locally
To test the project without service worker.
- Install all project dependencies with `npm install`
- Start the application server with `npm start`

To see service worker in action
- Run `npm run build`
- Run `serve -s build`
- Navigate to `http://localhost:5000/`



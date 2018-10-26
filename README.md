# Trending in Tampa Bay

A Google Maps web application displaying Tampa Bay's top trending places; this project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). The site gives a sidebar with a list of the places that can be filtered based on their category. The location markers on map, when clicked, open an info window giving additional information about their respective places including top photo and top tip shared by visitors. The service worker is implemented in the production build.

## Responsive Design
The site is mobile-first and fully responsive. The sidebar listing all the places is hidden on smaller screens and a hamburger icon can be clicked to show or hide sidebar.

## APIs and Packages

* To render map, a Google Maps React component from [google-maps-react](https://www.npmjs.com/package/google-maps-react) package is used.
* Top photo and tip shown in info window pop up is retrieved from [Foursquare](https://developer.foursquare.com/docs/api) API.

## How to Run

To test the project without service worker.

* Install all project dependencies with `npm install`
* Start the application server with `npm start`

To see service worker in action

* Run `npm run build`
* Run `serve -s build`
* Navigate to `http://localhost:5000/`

## Live Version
The live version of this app can be explored [here](https://ssaleem.github.io/Neighborhood-Map).

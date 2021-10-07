# React Leaflet Maps with Shapefile Support

[![example](https://github.com/oxy86/react-leaflet-maps-shapefile/raw/main/public/app-screenshot.jpg)](#)


This example React application uses [react-leaflet](https://www.npmjs.com/package/react-leaflet) and [shpjs](https://www.npmjs.com/package/shpjs?activeTab=readme) npm packages to display a full-screen interactive map (like google maps, without geolocation, but for free) with a simple button to upload geospatial data files in zipped [shapefile (.shp) spatial data format](https://en.wikipedia.org/wiki/Shapefile). As a bonus, it shows a marker on the centre of the map, and displays the latitude/longitude of that marker. :P

Supports 30+ free [Tile Layers](https://wiki.openstreetmap.org/wiki/Tile_servers), i.e. OpenStreetMap, Stamen, ESRI, Stadia, USGI, etc. 
Actually, the app includes an adapted copy of the [Leaflet-providers](https://github.com/leaflet-extras/leaflet-providers) configurations for various tiles providers. Fork it and edit the lib/TileProviders.js file to add your API keys, if you want to use one of the non-free tile providers (api key support not tested, though, you may have to hack it).

[Try the live app](https://oxy86.github.io/react-leaflet-maps-shapefile/) and have fun!

## Shapefiles (for testing)

There are some zipped shapefile examples in the 'shapefile-examples' folder in this repo:

- [World Borders](http://thematicmapping.org/downloads/world_borders.php) shapefile) 

### Other online shapefile sources

USA: The US Census Bureau offers zipped shapefiles in the following page (contains many state-based and national congressional district cartographic boundary data):

https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html

EU: The European Environment Agency offers zipped shapefiles and other GIS data of European countries in the following page (contains country borders and, where applicable, marine Exclusive Economic Zones): 

https://www.eea.europa.eu/data-and-maps/data/eea-reference-grids-2


## Available Scripts

The project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode. \
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


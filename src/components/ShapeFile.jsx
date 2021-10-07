import React, { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet'
import shp from 'shpjs'

export const ShapeFile = (props) => {
  const [ geoJSONData, setGeoJSONData ] = useState(null)
  const { data, ...geoJSONProps} = props


  useEffect(() => {
    async function fetchData() {
      // await here
      // or load https://www.npmjs.com/package/shpjs?activeTab=readme
      const response = await shp(props.data);
      setGeoJSONData(response);
      console.log("data loaded...")
    }
    fetchData();
  }, [props.data]); // Or [] if effect doesn't need props or state


 return (
  <GeoJSON key = {Math.random()} data = {geoJSONData} {...geoJSONProps}/>
  )

}

export default ShapeFile
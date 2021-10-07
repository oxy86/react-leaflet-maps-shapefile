import { useEffect, useState, useCallback } from 'react'
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
// Retrieve all Leaflet Default Icon options from CSS, in particular all icon images URL's, to improve compatibility with bundlers and frameworks that modify URL's in CSS. 
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { ShapeFile } from './ShapeFile';

import { TileProviders } from '../lib/TileProviders';

import  colorbrewer from 'colorbrewer';

var iconv = require('iconv-lite');




const MyMap = () => {
  
  // console.log(colorbrewer.schemeGroups.sequential);
  // console.log(colorbrewer)

  const center = [37.983810, 23.727539]
  const zoom = 7


  const [geodata, setGeodata] = useState(null);
  const [map, setMap] = useState(null)
  const [position, setPosition] = useState(map ? map.getCenter() : { lat: center[0], lng: center[1] })

  const { BaseLayer, Overlay } = LayersControl;


  // See: https://react-leaflet.js.org/docs/example-external-state/
  const DisplayPosition = (props) => {

    const onClick = useCallback(() => {
      props.map.setView(center, zoom)
    }, [props.map])

    const onMove = useCallback(() => {
      setPosition(props.map.getCenter())
    }, [props.map])

    useEffect(() => {
      props.map.on('move', onMove)
      return () => {
        props.map.off('move', onMove)
      }
    }, [props.map, onMove])

    return (
      <div>
        Marker at (lat, lon): ({position.lat.toFixed(4)}, {position.lng.toFixed(4)}{' '})
        <button onClick={onClick}>reset</button>
      </div>
    )
  }



  const handleFile = (e) => {
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.readAsArrayBuffer(file);
    reader.onload = function (buffer) {
      console.log("loading data...", file.name)
      setGeodata( {data: buffer.target.result, name: file.name });
    }
  }

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(Object.keys(feature.properties).map(function (k) {
        if(k === '__color__'){
          return;
        } 
        return k + ": " + feature.properties[k];
      }).join("<br />"), {
        maxHeight: 200
      });
    }
  }

  const style = (feature) => {
    console.log ( feature );
    return ({
      opacity: 1,
      fillOpacity: 0.7,
      radius: 6,
      weight: 2,
      dashArray: "2",
      // from http://stackoverflow.com/a/15710692
      // color: colorbrewer.Spectral[11][Math.abs(JSON.stringify(feature).split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)) % 11]
      color: colorbrewer.Spectral[11] [ Math.ceil(Math.random() * 1000) % 11]

    });
  }




  let ShapeLayers = null;
  if (geodata !== null) {
    ShapeLayers = (
      <Overlay checked name={geodata.name}>
        <ShapeFile 
          data={geodata.data} 
          style={style} 
          onEachFeature={onEachFeature} 
          />
      </Overlay>);
  }


  function MapPlaceholder() {
    return (
      <p>
        Map of Greece.{' '}
        <noscript>You need to enable JavaScript to see this map.</noscript>
      </p>
    )
  }


  return (
    <>

      {map ? <DisplayPosition map={map} position={position} setPosition={setPosition} /> : null}

      <div>
        Upload ShapeFile (.zip): <input type="file" accept=".zip" onChange={handleFile} className="inputfile" />
      </div>

      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ width: '100vw', height: "91vh" }} whenCreated={setMap} placeholder={<MapPlaceholder />}>

        <LayersControl position='topright'>

          {
            Object.keys(TileProviders).map((providerName, index) => {
              const tileProvider = TileProviders[providerName];
              var tileUrl = tileProvider.url;
              const options = tileProvider.options;

              var apiKey = false;

              if ( tileProvider.url && options.attribution && providerName !== 'MtbMap' && !options.bounds && !options.subdomains ) {
                
                const providerAttribution = options.attribution;

                
                if (tileUrl.search('{ext}') > -1) {
                  let ext = options.ext !== ''  ? options.ext : 'none';
                  tileUrl = tileUrl.replace("{ext}", ext );
                }
                if ( options.id && tileUrl.search('{id}') > -1 ) {
                  tileUrl = tileUrl.replace("{id}", options.id  );
                }
                if ( options.subdomains ) {
                  tileUrl = tileUrl.replace("{s}", options.subdomains[1]  );
                }
                if (tileUrl.search('{apikey}') > -1) {
                  apiKey = options.apikey !== ''  ? options.apikey : 'none';
                  tileUrl = tileUrl.replace("{apikey}", apiKey );
                }
                else if (tileUrl.search('{key}') > -1) {
                  apiKey = options.key !== ''  ? options.key : 'none';
                  tileUrl = tileUrl.replace("{apikey}", apiKey );
                }
                else if (tileUrl.search('{apiKey}') > -1) {
                  apiKey = options.apiKey !== ''  ? options.apiKey : 'none';
                  tileUrl = tileUrl.replace("{apiKey}", apiKey );
                }
                else if (tileUrl.search('{accessToken}') > -1) {
                  apiKey = options.accessToken !== ''  ? options.accessToken : 'none';
                  tileUrl = tileUrl.replace("{accessToken}", apiKey );
                }


                // console.log(providerName + ":" + tileUrl)

                if (tileProvider.variants) {

                  const variants = tileProvider.variants; 

                  return (
                    
                      Object.keys(variants).map((varName, varIdx) => {

                        const varFullName = providerName+" "+varName;
                        const variant = variants[varName];
                        const varOpts = variant.options && typeof variant.options === "object" ?  variant.options : undefined;
                        const varAttribution = varOpts && varOpts.attribution ?  varOpts.attribution : providerAttribution;
                        var varUrl = variant.url ? variant.url : tileUrl;


                        // console.log( " -- varFullName: " + varFullName + ": " + varUrl);

                        if (varUrl.search('{variant}') > -1 ) {
                          if ( typeof variant === "object" && varOpts && varOpts.variant ) {
                            // console.log('variant: ', varOpts.variant);
                            varUrl = varUrl.replace("{variant}", varOpts.variant );
                          }
                          else if ( typeof  variant !== "object" ) {
                            varUrl = varUrl.replace("{variant}", variant );                            
                          }
                          else {
                            varUrl = varUrl.replace("{variant}", varName);
                          }
                          
                        }
                        if (varUrl.search('{ext}') > -1) {
                          let ext = options.ext !== ''  ? options.ext : 'png';
                          ext = variant.options && variant.options.ext !== ''  ? variant.options.ext : 'png';
                          varUrl = varUrl.replace("{ext}", ext );
                        }
                        if ( options.subdomains ) {
                          varUrl = varUrl.replace("{s}", options.subdomains[1]  );
                        }
                        if (varUrl.search('{apikey}') > -1) {
                          apiKey = options.apikey !== ''  ? options.apikey : 'none';
                          varUrl = varUrl.replace("{apikey}", apiKey );
                        }
                        else if (varUrl.search('{key}') > -1) {
                          apiKey = options.key !== ''  ? options.key : 'none';
                          varUrl = varUrl.replace("{key}", apiKey );
                        }
                        else if (varUrl.search('{apiKey}') > -1) {
                          apiKey = options.apiKey !== ''  ? options.apiKey : 'none';
                          varUrl = varUrl.replace("{apiKey}", apiKey );
                        }
                        else if (varUrl.search('{accessToken}') > -1) {
                          apiKey = options.accessToken !== ''  ? options.accessToken : 'none';
                          varUrl = varUrl.replace("{accessToken}", apiKey );
                        }

                        // console.log( " --- varUrl: ", varUrl);

                        if ( !apiKey || apiKey !== 'none') {
                          return (
                            <BaseLayer checked={providerName==='OpenStreetMap' && varName==='Mapnik'} key={varIdx} name={varFullName}>
                              <TileLayer url={varUrl} attribution={varAttribution} />
                            </BaseLayer>
                          )      
                        }
                        else {
                          return (
                            <BaseLayer key={varIdx} name={varFullName}>
                          </BaseLayer>
                          )
                        }
                      })
    
    
                    
                  )
                }
                else {
                  if ( !apiKey || apiKey !== 'none') {
                    return (
                      <BaseLayer key={index} name={providerName}>
                        <TileLayer url={tileProvider.url} attribution={providerAttribution} />
                      </BaseLayer>
                    )
                  }

                }
              }

            })
          }

          {ShapeLayers}

        </LayersControl>

        <Marker position={map !== null ? map.getCenter() : center} draggable={true} animate={true}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>

      </MapContainer>
    </>
  );
};

export default MyMap;


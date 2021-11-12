import './App.scss';
import 'leaflet/dist/leaflet.css';
import {useState, useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import {Icon} from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
require('leaflet/dist/images/marker-icon-2x.png');

function App() {

  const [crimeFeatures, setCrimeFeatures] = useState([]);

  setTimeout(() => {
    const newFeatures = crimeFeatures.map(x =>{
      if(x.geometry){
        x.geometry.x = x.geometry?.x + .002

      }
      return x;
    })
    setCrimeFeatures([...newFeatures]);
  }, 2000);

  const icon = new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]});
  useEffect(() => {
    fetch('http://localhost:3001/')
      .then(result=>result.json())
      .then(crimeData => {
        //console.log(crimeData)
        setCrimeFeatures([...crimeData]);
      })
      .catch(e =>{console.log('Error getting map data', e)})
    return () => {
      //cleanup
    }
  }, [])
  
  const renderMarkers = (features)=>{
    
    return features.map(feature =>{
      if( !feature.geometry?.x || !feature.geometry?.y){
        return null
      }
      
      return (
        <Marker 
            position={[feature.geometry.y, feature.geometry.x]}
            icon={icon}
          >
            <Popup>
              {feature.attributes.IncidentType}
            </Popup>
        </Marker>
      )
    })
    
    
    
  }


  return (
    <div className="main">
      <header className="App-header">
        <h1>
          Map Application With Leaflet
        </h1>
      </header>
      <div className='map-section'>
        <div className='map'>
          
          <MapContainer 
            center={[35.107552, -106.638805]} 
            zoom={13} 
            style={{ height: "95vh", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {renderMarkers(crimeFeatures)}
          </MapContainer>
        </div>
        <div className='sidebar'>

        </div>
      </div>
    </div>
  );
}

export default App;

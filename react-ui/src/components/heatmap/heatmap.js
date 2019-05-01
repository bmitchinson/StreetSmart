import React from 'react';
import { render } from 'react-dom';
import { Marker, Popup, TileLayer, Map as LeafletMap } from 'react-leaflet'; // Just Map
import HeatmapLayer from './HeatmapLayer';
import { addressPoints } from './realworld.10000.js';

class MapExample extends React.Component {

  render() {
    return (
      <LeafletMap
        center={[50, 10]}
        zoom={6}
        maxZoom={10}
        attributionControl={true}
        zoomControl={true}
        doubleClickZoom={true}
        scrollWheelZoom={true}
        dragging={true}
        animate={true}
        easeLinearity={0.35}
      >
        <TileLayer
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={[50, 10]}>
          <Popup>
            Popup for any custom information.
          </Popup>
        </Marker>
      </LeafletMap>
    );
  }
  
}

{/* <Map center={[0,0]} zoom={13}>
<HeatmapLayer
fitBoundsOnLoad
fitBoundsOnUpdate
points={addressPoints}
longitudeExtractor={m => m[1]}
latitudeExtractor={m => m[0]}
intensityExtractor={m => parseFloat(m[2])} />
<TileLayer
url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
/>
</Map> */}

export default MapExample;
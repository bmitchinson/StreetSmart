import React from 'react';
import { render } from 'react-dom';
import { Marker, Popup, TileLayer, Map } from 'react-leaflet'; // Just Map
import HeatmapLayer from './HeatmapLayer';
import { addressPoints } from './realworld.10000.js';
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import { Row, Col, Card, CardHeader } from "shards-react";

var moment = require('moment');


class MapExample extends React.Component {

  constructor() {
    super();
    this.fillDataPoints = this.fillDataPoints.bind(this);
    this.state = ({
      dataPoints: [],
      date: new moment('2019-06-19','YYYY-MM-DD').startOf('day')
    })
  }
  // '05-14-2019 10:45', 'MM-DD-YYYY hh:mm'

  componentDidMount() {
    this.fillDataPoints();
  }

  fillDataPoints() {
    let base = (window.location.href)
    base = base.split("/")
    base = base[0] + "//" + base[2]
    base = base.replace('3000', '5000')

    let url = base + '/events?Date=' + this.state.date.format('x')
    console.log("Map fetching: " + url)

    fetch(url)
      .then(response => response.json())
      .then(data => {
        let newPoints = [];
        for (var i = Object.keys(data).length - 1; i >= 0; i--) {
          newPoints.push([
            data[i].Location._lat,
            data[i].Location._long,
            (data[i].SpeedStatus > 0) ? (data[i].SpeedStatus*data[i].SpeedStatus) : (5)
          ])
        }
        if (newPoints.length != this.state.dataPoints.length){
          this.setState({dataPoints: newPoints}, () => console.log("Set state to:" + this.state.dataPoints))
        }
      })
  }

  render() {
    return (
      <Card small className="h-100">
        <CardHeader className="border-bottom">
          <h6 className="m-0">Heat Map</h6>
        </CardHeader>
        <Row form>
          <Col md="2" className="form-group">
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <DatePicker
                style={{paddingLeft:"15px"}}
                value={this.state.date}
                onChange={(selection) => {
                  this.setState({
                    date: selection.startOf('day')
                  }, () => this.fillDataPoints())
                }}
                animateYearScrolling
                />
            </MuiPickersUtilsProvider>
          </Col>
        </Row>
        <Map center={[41.663611, -91.534595]} zoom={15} scrollWheelZoom={false}>
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            blur={20}
            points={this.state.dataPoints}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2])} />
          <TileLayer
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
        </Map>
      </Card>
    );
  }

}

{/* <LeafletMap
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
      </LeafletMap> */}

export default MapExample;
import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Form,
  FormGroup,
  FormFeedback,
  FormSelect
} from "shards-react";
import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import PageTitle from "../components/common/PageTitle";
var moment = require('moment');

class Tables extends React.Component {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDriverChange = this.handleDriverChange.bind(this);
    this.handleSpeedingChange = this.handleSpeedingChange.bind(this);
    this.handleSpeedChange = this.handleSpeedChange.bind(this);
    this.handleSpeedLimitChange = this.handleSpeedLimitChange.bind(this);
    this.handleRealData = this.handleRealData.bind(this);
    this.filter = this.filter.bind(this);

    this.state = ({
      Filter: {
        Date: new moment().startOf('day'),
        Driver: "All",
        Speeding: "All",
        Speed: "All",
        SpeedLimit: "All",
        RealData: "All"
      },
      Events: {
      }
    })
  }

  componentDidMount() {
    this.filter()
  }

  filter() {
    let base = (window.location.href)
    base = base.split("/")
    base = base[0] + "//" + base[2]
    base = base.replace('3000', '5000')

    let url = base + '/events?Date=' + this.state.Filter.Date.format('x')

    url = (this.state.Filter.Driver === "All") ? url :
      (url + '&Driver=' + this.state.Filter.Driver)

    url = (this.state.Filter.Speeding === "All") ? url :
      (url + '&Speeding=' + this.state.Filter.Speeding)

    url = (this.state.Filter.Speed === "All") ? url :
      (url + '&Speed=' + this.state.Filter.Speed)

    url = (this.state.Filter.SpeedLimit === "All") ? url :
      (url + '&SpeedLimit=' + this.state.Filter.SpeedLimit)

    url = (this.state.Filter.RealData === "All") ? url :
      (url + '&RealData=' + this.state.Filter.RealData)

    console.log(url)
    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({ Events: data }, () => console.log("SSet")));
  }

  handleDateChange(selection) {
    this.setState(prevState => ({
      Filter: {
        ...prevState.Filter,
        Date: selection.startOf('day')
      }
    }), this.filter)
  }

  handleDriverChange(e) {
    let update = e.target.value
    this.setState(prevState => ({
      Filter: {
        ...prevState.Filter,
        Driver: update
      }
    }), this.filter)
  }

  handleSpeedingChange(e) {
    let update = e.target.value
    this.setState(prevState => ({
      Filter: {
        ...prevState.Filter,
        Speeding: update
      }
    }), this.filter)
  }

  handleSpeedChange(e) {
    let update = e.target.value
    this.setState(prevState => ({
      Filter: {
        ...prevState.Filter,
        Speed: update
      }
    }), this.filter)
  }

  handleSpeedLimitChange(e) {
    let update = e.target.value
    this.setState(prevState => ({
      Filter: {
        ...prevState.Filter,
        SpeedLimit: update
      }
    }), this.filter)
  }

  handleRealData(e) {
    let update = e.target.value
    this.setState(prevState => ({
      Filter: {
        ...prevState.Filter,
        RealData: update
      }
    }), this.filter)
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle sm="4" title="Event Log" subtitle="" className="text-sm-left" />
        </Row>

        {/* Default Light Table */}
        <Row>
          <Col>
            <Card small className="mb-4">
              <CardHeader className="border-bottom">
                <Form>
                  <Row form>

                    <Col md="2" className="form-group">
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          style={{paddingTop:"15px"}}
                          value={this.state.Filter.Date}
                          onChange={this.handleDateChange}
                          animateYearScrolling
                          />
                      </MuiPickersUtilsProvider>
                    </Col>

                    <Col md="2" className="form-group">
                    <label style={{margin:'auto'}}>Driver</label>
                      <FormSelect
                        value={this.state.Filter.Driver}
                        onChange={this.handleDriverChange}
                      >
                        <option>All</option>
                        <option>Tyler</option>
                        <option>Er-Wei</option>
                      </FormSelect>
                    </Col>

                    <Col md="2" className="form-group">
                    <label style={{margin:'auto'}}>Speeding</label>
                      <FormSelect
                        value={this.state.Filter.Speeding}
                        onChange={this.handleSpeedingChange}
                      >
                        <option>All</option>
                        <option>OverLimit</option>
                        <option>UnderLimit</option>
                      </FormSelect>
                    </Col>

                    <Col md="2" className="form-group">
                    <label style={{margin:'auto'}}>Speed</label>
                      <FormSelect
                        value={this.state.Filter.Speed}
                        onChange={this.handleSpeedChange}
                      >
                        <option>All</option>
                        <option>10-25</option>
                        <option>25-35</option>
                        <option>35-45</option>
                        <option>45-60</option>
                        <option>60-75</option>
                        <option>75-90</option>
                        <option>90+</option>
                      </FormSelect>
                    </Col>

                    <Col md="2" className="form-group">
                    <label style={{margin:'auto'}}>Speed Limit</label>
                      <FormSelect
                        value={this.state.Filter.SpeedLimit}
                        onChange={this.handleSpeedLimitChange}
                      >
                        <option>All</option>
                        <option>10-25</option>
                        <option>25-35</option>
                        <option>35-45</option>
                        <option>45-60</option>
                        <option>60-75</option>
                        <option>75-90</option>
                      </FormSelect>
                    </Col>

                    <Col md="2" className="form-group">
                    <label style={{margin:'auto'}}>Sensor/Sim</label>
                      <FormSelect
                        value={this.state.Filter.RealData}
                        onChange={this.handleRealData}
                      >
                        <option>All</option>
                        <option>Sensor</option>
                        <option>Sim</option>
                        <option>Both</option>
                      </FormSelect>
                    </Col>

                  </Row>
                </Form>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        Time
                      </th>
                      <th scope="col" className="border-0">
                        Driver
                      </th>
                      <th scope="col" className="border-0">
                        Location
                      </th>
                      <th scope="col" className="border-0">
                        Battery
                      </th>
                      <th scope="col" className="border-0">
                        Speed
                      </th>
                      <th scope="col" className="border-0">
                        Speed Limit
                      </th>
                      <th scope="col" className="border-0">
                        Speed Status (+/-)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(this.state.Events).map((event, idx) => (
                      <tr key={idx}>
                        <td>{moment(event.Time.seconds, 'X').format("lll")}</td>
                        <td>{event.Driver}</td>
                        <td>{Number.parseFloat(event.Location._lat).toFixed(6)},
                         {Number.parseFloat(event.Location._long).toFixed(6)}</td>
                        <td>{event.Battery}%</td>
                        <td>{Number.parseFloat(event.Speed).toFixed(0)}MPH</td>
                        <td>{Number.parseFloat(event.SpeedLimit).toFixed(0)}MPH</td>
                        <td>{(Math.sign(event.SpeedStatus) == 1) ? '+' : ''}
                          {Number.parseFloat(event.SpeedStatus).toFixed(0)}MPH</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container >
    )
  }
}

export default Tables;

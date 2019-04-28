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
    this.filterHit = this.filterHit.bind(this);

    this.state = ({
      Filter: {
        Date: new Date(),
        Driver: "Driver...",
        Speeding: "Speeding...",
        Speed: "Speed...",
        SpeedLimit: "Speed Limit ..."
      },
      Events: {
      }
    })
  }

  filterHit(e){
    console.log("Filter applied")
  }

  handleDateChange(date) {
    this.setState({
      Date: date
    })
  }

  handleDriverChange(e) {
    this.setState({
      Filter: {
        Driver: e.target.value
      }
    })
  }

  handleSpeedingChange(e) {
    this.setState({
      Filter: {
        Speeding: e.target.value
      }
    })
  }

  handleSpeedChange(e) {
    this.setState({
      Filter: {
        Speed: e.target.value
      }
    })
  }

  handleSpeedLimitChange(e) {
    this.setState({
      Filter: {
        SpeedLimit: e.target.value
      }
    })
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
                <h6 className="m-0">Events</h6>
              </CardHeader>
              <CardHeader className="border-bottom">
                <Form>
                  <Row form>

                    <Col md="1" className="form-group">
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          value={this.state.Filter.Date}
                          onChange={this.handleDateChange}
                          animateYearScrolling
                        />
                      </MuiPickersUtilsProvider>
                    </Col>

                    <Col md="1" className="form-group">
                      <FormGroup>
                        <FormSelect
                          value={this.state.Filter.Driver}
                          onChange={this.handleDriverChange}
                        >
                          <option>Driver...</option>
                          <option>Tyler</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>

                    <Col md="1" className="form-group">
                      <FormGroup>
                        <FormSelect
                          value={this.state.Filter.Speeding}
                          onChange={this.handleSpeedingChange}
                        >
                          <option>Speeding...</option>
                          <option>Over Limit</option>
                          <option>Under Limit</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>

                    <Col md="1" className="form-group">
                      <FormGroup>
                        <FormSelect
                          value={this.state.Filter.Speed}
                          onChange={this.handleSpeedChange}
                        >
                          <option>Speed...</option>
                          <option>10-25</option>
                          <option>25-35</option>
                          <option>35-45</option>
                          <option>45-60</option>
                          <option>60-75</option>
                          <option>75-90</option>
                          <option>90+</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>

                    <Col md="1" className="form-group">
                      <FormGroup>
                        <FormSelect
                          value={this.state.Filter.SpeedLimit}
                          onChange={this.handleSpeedLimitChange}
                        >
                          <option>Speed Limit...</option>
                          <option>10-25</option>
                          <option>25-35</option>
                          <option>35-45</option>
                          <option>45-60</option>
                          <option>60-75</option>
                          <option>75-90</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>

                    <Col>
                      <Button outline theme="primary" className="mb-2 mr-1"
                        onClick={this.filterHit}>
                        Filter
                      </Button>
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
                        <td>{event.Speed}MPH</td>
                        <td>{event.SpeedLimit}MPH</td>
                        <td>{(Math.sign(event.SpeedStatus) == 1) ? '+' : ''}
                          {event.SpeedStatus}MPH</td>
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

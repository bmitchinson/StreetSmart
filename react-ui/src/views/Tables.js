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
    this.handleDriverChange = this.handleDriverChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.state = ({
      Date: new Date(),
      Events: {
        0: {
          "Battery": 38,
          "Driver": "Tyler",
          "Location": { "_lat": 41.64948079186202, "_long": -91.51943063714101 },
          "RealData": false,
          "Speed": 52,
          "SpeedLimit": 45,
          "SpeedStatus": 7,
          "StatusCode": "",
          "Time": { "seconds": 1556172915, "nanoseconds": 0 }
        }
      }
    })
  }

  handleDriverChange(e) {
    console.log("Chose: " + e.target.value);
  }

  handleDateChange(date) {
    this.setState({
      Date: date
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
                      <FormGroup>
                        <FormSelect
                          value="Driver..."
                          onChange={this.handleDriverChange}
                        >
                          <option value="Driver...">Driver...</option>
                          <option>Tyler</option>
                        </FormSelect>
                      </FormGroup>
                    </Col>
                    <Col md="1" className="form-group">
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DatePicker
                          value={this.state.Date}
                          onChange={this.handleDateChange}
                          animateYearScrolling
                        />
                      </MuiPickersUtilsProvider>
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
                        SpeedLimit
                      </th>
                      <th scope="col" className="border-0">
                        SpeedStatus
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(this.state.Events).map((event, idx) => (
                      <tr key={idx}>
                        <td>Date</td>
                        <td>{event.Driver}</td>
                        <td>{Number.parseFloat(event.Location._lat).toFixed(6)}, 
                        {Number.parseFloat(event.Location._long).toFixed(6)}</td>
                        <td>{event.Battery}</td>
                        <td>{event.Speed}</td>
                        <td>{event.SpeedLimit}</td>
                        <td>{event.SpeedStatus}</td>
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

import React from "react";
import { Container, 
  Row, 
  Col, 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Form,
  FormGroup,
  FormFeedback,
  FormSelect } from "shards-react";

import PageTitle from "../components/common/PageTitle";
class Tables extends React.Component {
  constructor(props) {
    super(props);
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
                    <Col md="3" className="form-group">
                      <FormGroup>
                        <FormSelect>
                          <option>Choose...</option>
                          <option>Tyler</option>
                        </FormSelect>
                        <FormFeedback>Driver</FormFeedback>
                      </FormGroup>
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
                    <tr>
                      <td>Apr 25th 2019 - 1:15:30</td>
                      <td>Tyler</td>
                      <td>41.661094, -91.537</td>
                      <td>43</td>
                      <td>42</td>
                      <td>35</td>
                      <td>7</td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Tables;

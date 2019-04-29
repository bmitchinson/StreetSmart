import React from "react";
import { Container, Row, Col } from "shards-react";

import PageTitle from "../components/common/PageTitle";
import BellDetails from "../components/user-profile-lite/BellDetails";
import BaiDetails from "../components/user-profile-lite/BaiDetails";
import UserAccountDetails from "../components/user-profile-lite/UserAccountDetails";

const UserProfileLite = () => (
  <Container fluid className="main-content-container px-4">
    <Row noGutters className="page-header py-4">
      <PageTitle title="User Profiles" subtitle="Overview" md="12" className="ml-sm-auto mr-sm-auto" />
    </Row>
    <Row>
      <Col lg="4">
        <BellDetails />
      </Col>
      <Col lg="4">
        <BaiDetails />
      </Col>
    </Row>
  </Container>
);

export default UserProfileLite;

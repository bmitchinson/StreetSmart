import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, CardHeader } from "shards-react";

import PageTitle from "./../components/common/PageTitle";
import SmallStats from "./../components/common/SmallStats";
import UsersOverview from "./../components/blog/UsersOverview";
import UsersByDevice from "./../components/blog/UsersByDevice";
import NewDraft from "./../components/blog/NewDraft";
import Discussions from "./../components/blog/Discussions";
import TopReferrals from "./../components/common/TopReferrals";
import MapExample from "./../components/heatmap/heatmap";
import { Component } from "react";

class BlogOverview extends Component {

  constructor() {
    super();
    this.state = {
      GraphOne: {
        label: "% Time Speeding vs Last Month",
        value: "60%",
        percentage: "16%",
        increase: false,
        chartLabels: [null, null, null, null, null, null, null],
        attrs: { lg: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(0, 184, 216, 0.1)",
            borderColor: "rgb(0, 184, 216)",
            data: [3, 5, 1, 2, 1, 1, 3]
          }
        ]
      },
      GraphTwo: {
        label: "% Time Speeding vs Last Week",
        value: "73.2%",
        percentage: "4.7%",
        increase: true,
        chartLabels: [null, null, null, null, null, null, null],
        attrs: { lg: "6" },
        datasets: [
          {
            label: "Today",
            fill: "start",
            borderWidth: 1.5,
            backgroundColor: "rgba(0, 184, 216, 0.1)",
            borderColor: "rgb(0, 184, 216)",
            data: [1, 2, 1, 3, 5, 4, 7]
          }
        ]
      }
    }
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle title="Your Driver Dashboard" subtitle="" className="text-sm-left mb-3" />
        </Row>

        {/* Small Stats Blocks */}
        <Row>
          <Col className="col-lg mb-4" key={0} {...this.state.GraphOne.attrs}>
            <SmallStats
              id={`small-stats-${0}`}
              variation="1"
              chartData={this.state.GraphOne.datasets}
              chartLabels={this.state.GraphOne.chartLabels}
              label={this.state.GraphOne.label}
              value={this.state.GraphOne.value}
              percentage={this.state.GraphOne.percentage}
              increase={this.state.GraphOne.increase}
              decrease={this.state.GraphOne.decrease}
            />
          </Col>
          <Col className="col-lg mb-4" key={1} {...this.state.GraphTwo.attrs}>
            <SmallStats
              id={`small-stats-${1}`}
              variation="1"
              chartData={this.state.GraphTwo.datasets}
              chartLabels={this.state.GraphTwo.chartLabels}
              label={this.state.GraphTwo.label}
              value={this.state.GraphTwo.value}
              percentage={this.state.GraphTwo.percentage}
              increase={this.state.GraphTwo.increase}
              decrease={this.state.GraphTwo.decrease}
            />
          </Col>
        </Row>

        <Row>
          {/* Users Overview */}
          <Col lg="8" md="12" sm="12" className="mb-4">
            <MapExample />
          </Col>

          {/* Users by Device */}
          <Col lg="4" md="12" sm="12" className="mb-4">
            <UsersByDevice />
          </Col>
        </Row>

      </Container>
    )
  }
}

BlogOverview.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array
};

BlogOverview.defaultProps = {
  smallStats: [
    {
      label: "Posts",
      value: "2,390",
      percentage: "4.7%",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(0, 184, 216, 0.1)",
          borderColor: "rgb(0, 184, 216)",
          data: [1, 2, 1, 3, 5, 4, 7]
        }
      ]
    },
    {
      label: "Pages",
      value: "182",
      percentage: "12.4",
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "6", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(23,198,113,0.1)",
          borderColor: "rgb(23,198,113)",
          data: [1, 2, 3, 3, 3, 4, 4]
        }
      ]
    },
    {
      label: "Comments",
      value: "8,147",
      percentage: "3.8%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(255,180,0,0.1)",
          borderColor: "rgb(255,180,0)",
          data: [2, 3, 3, 3, 4, 3, 3]
        }
      ]
    },
    {
      label: "New Customers",
      value: "29",
      percentage: "2.71%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgba(255,65,105,0.1)",
          borderColor: "rgb(255,65,105)",
          data: [1, 7, 1, 3, 1, 4, 8]
        }
      ]
    },
    {
      label: "Subscribers",
      value: "17,281",
      percentage: "2.4%",
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: "4", sm: "6" },
      datasets: [
        {
          label: "Today",
          fill: "start",
          borderWidth: 1.5,
          backgroundColor: "rgb(0,123,255,0.1)",
          borderColor: "rgb(0,123,255)",
          data: [3, 2, 3, 2, 4, 5, 4]
        }
      ]
    }
  ]
};

export default BlogOverview;

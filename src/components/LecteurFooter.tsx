import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
export const Lecteur: React.FC = ({ children }) => {
  return (
    <Row>
      <Col xs={12}>
        <div id="LecteurFooter">
          <img
            src="https://d1fmx1rbmqrxrr.cloudfront.net/cnet/optim/i/edit/2019/04/eso1644bsmall__w770.jpg"
            width="150vh"
            height="180vh"
          />
          <div>{children}</div>
        </div>
      </Col>
    </Row>
  );
};

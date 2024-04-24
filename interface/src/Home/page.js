import React from "react";

import { Container, Row, Col } from "react-bootstrap";

import CustomSearchBar from "./CustomSearchBar.js";
// import "./premade_theme/css/styles.css";

export default function Home() {
  return (
    <div>
    {/*  Navigation */}
      
      <header className="masthead">
      <Container fluid style={{ position: "relative" }}>
      {/* Note to self, the row height, doesn't change how the inner elements fit. */}
        <Row style={{ justifyContent: "center"}}>
          <Col xl={6} style={{ justifyContent: "center"}}>
            <h1 className="mb-5">
              Welcome to DiscoDB!
            </h1>
            <p>Use the search bar below to get started saving albums to your listening lists!</p>
            {/* TODO: insert our custom search bar. */}
            <CustomSearchBar/>
          </Col>
        </Row>
      </Container>
      </header>
      
      {/* Footer */}
      <footer className="footer bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 h-100 text-center text-lg-start my-auto">
              <ul className="list-inline mb-2">
                <li className="list-inline-item">
                  <a href="#!">About</a>
                </li>
                <li className="list-inline-item">⋅</li>
                <li className="list-inline-item">
                  <a href="#!">Contact</a>
                </li>
                <li className="list-inline-item">⋅</li>
                <li className="list-inline-item">
                  <a href="#!">Terms of Use</a>
                </li>
                <li className="list-inline-item">⋅</li>
                <li className="list-inline-item">
                  <a href="#!">Privacy Policy</a>
                </li>
              </ul>
              <p className="text-muted small mb-4 mb-lg-0">
                &copy; DiscoDB 2024. All Rights Reserved.
              </p>
            </div>
            <div className="col-lg-6 h-100 text-center text-lg-end my-auto">
              <ul className="list-inline mb-0">
                <li className="list-inline-item me-4">
                  <a href="#!">
                    <i className="bi-facebook fs-3"></i>
                  </a>
                </li>
                <li className="list-inline-item me-4">
                  <a href="#!">
                    <i className="bi-twitter fs-3"></i>
                  </a>
                </li>
                <li className="list-inline-item">
                  <a href="#!">
                    <i className="bi-instagram fs-3"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
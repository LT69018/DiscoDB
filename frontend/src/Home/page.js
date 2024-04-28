
import {
  React, 
  useState, // in case I want to store an API result in state
  useEffect // to run fetch request!
} from "react";
import { Container, Row, Col } from "react-bootstrap";

import CustomSearchBar from "./CustomSearchBar.js";
// import "./premade_theme/css/styles.css";

export default function Home() {


	const [state, setState] = useState();
  /*
  useEffect(() => {
    fetch("localhost:5000/testFrontendConnection", {
      method: "GET", 
      headers: {
        "Allow-origin": "*",
        "Content-Type":"application/json"}})
      .then((response) => response.json)
      .then((data) => console.log("[Frontend: Home/page.js] Data =", data))
      .catch(error => console.log("[Frontend:Home/page.js] Got error:", error))
  });
  */
  return (
    // TODO: add user profile (past, present, future) listening tables.
    // <div>
    // {/*  Navigation */}
      
    // //   {/* <header className="masthead"> */}
    //   <Container fluid style={{ position: "relative" }}>
    //   {/* Note to self, the row height, doesn't change how the inner elements fit. */}
    <div class="container-fluid">
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
      </div>
      // </Container>
      // {/* </header> */}
    // </div>
    
  );
}
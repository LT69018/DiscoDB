import logo from "./logo.svg";
import './App.css';


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// page imports
import Home from "./Home/page.js";
import SearchResults from "./SearchResults/page.js"

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route index path={"/"} element={<Home/>}></Route>
					<Route path={"/SearchResults"} element={<SearchResults/>}></Route>
				</Routes>
			</Router>
			
		</div>
	);
}

export default App;

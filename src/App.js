import React from 'react';
import './App.css';
import EasyPortfolioContainer from './EasyPortfolio/EasyPortfolioContainer';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {

  return (

    <EasyPortfolioContainer/>
    // <Router>
    // <h1>hi</h1>
    // <Link to="/app/">Get Started</Link>

    // <Route path="/app/" component={EasyPortfolioContainer} />
    // </Router>
  );
}

export default App;

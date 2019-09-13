import React from "react";
import "./App.css";
import EasyPortfolioContainer from "./EasyPortfolio/EasyPortfolioContainer";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Tokenfolio from "./EasyPortfolio/components/Tokenfolio";
import Portfolios from "./EasyPortfolio/components/Portfolios";

function App() {
  let binanceWorkflow = window.location.href.includes("binance") ? true : false;
  let development = window.location.href.includes("localhost") ? true : false;
  let componentToRender = <EasyPortfolioContainer />;

  if (binanceWorkflow) {
    componentToRender = (
      <Tokenfolio development={development} binanceWorkflow={binanceWorkflow} />
    );
  }

  return (
    <Router>
      <>
        <Route path="/" exact render={props => componentToRender} />
        <Route path="/portfolio/" render={props => componentToRender} />
        <Route path="/portfolios/" component={Portfolios} />
      </>
    </Router>
  );
}

export default App;

import React from "react";
import "./App.css";
import EasyPortfolioContainer from "./EasyPortfolio/EasyPortfolioContainer";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Tokenfolio from "./EasyPortfolio/components/Tokenfolio";

function App() {
  let binanceWorkflow = window.location.href.includes("binance") ? true : false;
  let componentToRender = <EasyPortfolioContainer />;

  if (binanceWorkflow) {
    componentToRender = <Tokenfolio binanceWorkflow={binanceWorkflow} />;
  }

  return componentToRender;
}

export default App;

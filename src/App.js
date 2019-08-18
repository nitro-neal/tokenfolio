import React from "react";
import "./App.css";
import EasyPortfolioContainer from "./EasyPortfolio/EasyPortfolioContainer";

import Tokenfolio from "./EasyPortfolio/components/Tokenfolio";

function App() {
  let binanceWorkflow = window.location.href.includes("binance") ? true : false;
  let development = window.location.href.includes("localhost") ? true : false;
  let componentToRender = <EasyPortfolioContainer />;

  if (binanceWorkflow) {
    componentToRender = (
      <Tokenfolio development={development} binanceWorkflow={binanceWorkflow} />
    );
  }

  return componentToRender;
}

export default App;

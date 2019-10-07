import React from "react";
import "./App.css";
import EasyPortfolioContainer from "./EasyPortfolio/EasyPortfolioContainer";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Tokenfolio from "./EasyPortfolio/components/Tokenfolio";
import Portfolios from "./EasyPortfolio/components/Portfolios";

import firebase from "firebase";
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCTgaeas3mNmPK-baCDEf1fqT3nSx1mY0I",
  authDomain: "easy-kyber-portfolio.firebaseapp.com",
  databaseURL: "https://easy-kyber-portfolio.firebaseio.com",
  projectId: "easy-kyber-portfolio",
  storageBucket: "easy-kyber-portfolio.appspot.com",
  messagingSenderId: "724874509261",
  appId: "1:724874509261:web:8013b52f13bff894c96284",
  measurementId: "G-54GG91D014"
};

firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

function App() {
  let binanceWorkflow = window.location.href.includes("binance") ? true : false;
  let development = window.location.href.includes("localhost") ? true : false;
  let portfoliosComponent = <Portfolios db={db} />;
  let componentToRender = <EasyPortfolioContainer />;

  if (binanceWorkflow) {
    componentToRender = (
      <Tokenfolio
        development={development}
        binanceWorkflow={binanceWorkflow}
        db={db}
      />
    );
  }

  return (
    <Router>
      <>
        <Route path="/" exact render={props => componentToRender} />
        <Route path="/portfolio/" render={props => componentToRender} />
        <Route path="/portfolios/" render={props => portfoliosComponent} />
      </>
    </Router>
  );
}

export default App;

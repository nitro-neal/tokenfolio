import React from 'react';
import logo from './logo.svg';
import './App.css';
import ButtonPage from './EasyPortfolio/ButtonPage';
import GridExamplesPage from './EasyPortfolio/GirdExamplePage';
import EasyPortfolioContainer from './EasyPortfolio/EasyPortfolioContainer';




// import EasyPortfolioContainer from '.EasyPortfolio/EasyPortfolioContainer';


// TUTORIAL - https://mdbootstrap.com/docs/react/components/buttons/

function App() {

  return (
    // <ButtonPage/>
    // <GridExamplesPage/>
    <EasyPortfolioContainer/>
  );
  // return (
  //   <div className="App">
  //     <header className="App-header">
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.js</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //     <ButtonPage/>
  //   </div>
  // );
}

export default App;

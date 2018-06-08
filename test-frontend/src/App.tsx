import * as React from 'react';
import './App.css';
import Crowdsourcing from './components/crowdsourcing';
import Demo from './components/demo';
import ProjectsGrid from './components/projectgrid';

import logo from './logo.svg';

class App extends React.Component {

  public render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="App-intro">
          <Crowdsourcing />
          <Demo />
          <ProjectsGrid />
        </div>
      </div>
    );
  }
}

export default App;

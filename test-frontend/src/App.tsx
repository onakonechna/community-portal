import * as React from 'react';
import './App.css';
import Crowdsourcing from './components/crowdsourcing';
import ProjectsGrid from './components/projectGrid';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Crowdsourcing />
        <ProjectsGrid />
      </div>
    );
  }
}

export default App;

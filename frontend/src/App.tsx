import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from './components/Auth';
import HeadBar from './components/HeadBar';
import ProjectGrid from './components/ProjectGrid';

declare const __FRONTEND__: string;
const fn = __FRONTEND__;

class App extends React.Component {
  public render() {
    console.log(fn);
    return (
      <div>
        <HeadBar />
        <ProjectGrid />
        <Route exact path="/auth" component={Auth}/>
      </div>
    );
  }
}

export default App;

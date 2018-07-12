import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from './components/Auth';
import HeadBar from './components/HeadBar';
import WithProjectGrid from './components/WithProjectGrid';

class App extends React.Component {
  public render() {
    return (
      <div>
        <HeadBar />
        <Route exact path="/" component={WithProjectGrid} />
        <Route exact path="/auth" component={Auth}/>
        <Route exact path="/bookmarked" render={
          () => <WithProjectGrid filter="bookmarkedProjects" />
        } />
      </div>
    );
  }
}

export default App;

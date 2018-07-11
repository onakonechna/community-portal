import * as React from 'react';
import { Route } from 'react-router-dom';

import Auth from './components/Auth';
import HeadBar from './components/HeadBar';
import BookmarkedProjectTable from './components/BookmarkedProjectTable';
import ProjectGrid from './components/ProjectGrid';

class App extends React.Component {
  public render() {
    return (
      <div>
        <HeadBar />
        <BookmarkedProjectTable />
        <ProjectGrid />
        <Route exact path="/auth" component={Auth}/>
      </div>
    );
  }
}

export default App;

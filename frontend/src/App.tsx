import * as React from 'react';
import MessageBar from './components/MessageBar';

import Routes from './routes';

class App extends React.Component {
  public render() {
    return (
      <div>
        <MessageBar />
        <Routes />
      </div>
    );
  }
}

export default App;

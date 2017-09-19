import React from 'react';
import { inject, observer } from 'mobx-react';

const App = inject('uiState')(observer(class App extends React.Component {
  render() {
    return <div>
      This is the app
    </div>
  }
}));

export default App;

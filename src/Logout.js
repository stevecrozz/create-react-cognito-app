import React from 'react';
import { inject, observer } from 'mobx-react';

const Logout = inject('uiState')(observer(class Logout extends React.Component {
  componentWillMount() {
    this.props.uiState.logout();
  }

  render() {
    return <div>
      You have been signed out.
    </div>
  }
}));

export default Logout;

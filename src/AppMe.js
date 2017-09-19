import React from 'react'
import { inject, observer } from 'mobx-react'
import { Link } from 'react-router-dom'

const AppMe = inject('uiState')(observer(class AppMe extends React.Component {
  render() {
    return <div>
      This is me
      <dl>
        <dt>Email</dt>
        <dd>{ this.props.uiState.userAttributes.get('email') }</dd>
        <dt>Password</dt>
        <dd><Link to="/app/me/change-password">change</Link></dd>
      </dl>
    </div>
  }
}));

export default AppMe;

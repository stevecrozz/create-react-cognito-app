import React from 'react';
import { observer, inject } from 'mobx-react';

const Footer = inject('uiState')(observer(class Footer extends React.Component {
  render() {
    return <div>
      {this.welcome}
    </div>
  }

  get welcome() {
    let user = this.props.uiState.userInfo.get('user');
    if (user) {
      return <div>Welcome, {user.username}</div>
    } else {
      return <div></div>
    }
  }
}))

export default Footer;

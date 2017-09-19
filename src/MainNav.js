import React from 'react';
import { Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

const MainNav = inject('uiState')(observer(class Ui extends React.Component {
  render() {
    return <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">PerfScope</a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            { this.home }
            { this.me }
            { this.signup }
            { this.login }
            { this.logout }
          </ul>
        </div>
      </div>
    </nav>
  }

  get home() {
    return <li><Link to="/">Home</Link></li>
  }

  get me() {
    if (this.props.uiState.user) {
      return <li><Link to="/app/me">Account</Link></li>
    }
  }

  get signup() {
    if (!this.props.uiState.user) {
      return <li><Link to="/signup">Signup</Link></li>
    }
  }

  get login() {
    if (!this.props.uiState.user) {
      return <li><Link to="/login">Login</Link></li>
    }
  }

  get logout() {
    if (this.props.uiState.user) {
      return <li><Link to="/logout">Logout</Link></li>
    }
  }
}));
export default MainNav;

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { observer, Provider } from 'mobx-react'
import Signup from './Signup'
import Login from './Login'
import PleaseConfirm from './PleaseConfirm'
import Home from './Home'
import UiState from './UiState'
import Footer from './Footer'
import LoadingIndicator from './LoadingIndicator'
import MainNav from './MainNav'
// import DevTools from 'mobx-react-devtools'
import Logout from './Logout'
import App from './App'
import AppMe from './AppMe'
import AppMeChangePassword from './AppMeChangePassword'
import ForgotPassword from './ForgotPassword'

const Main = observer(class Main extends React.Component {
  render() {
    return <BrowserRouter>
      <Provider uiState={UiState}>
        <div>
          <div id="nonfooter" style={{
            minHeight: "100%",
            height: "auto",
            margin: "0 auto -60px",
            padding: "0 0 60px"
          }}>
            {/*<DevTools />*/}
            <LoadingIndicator />
            <MainNav />

            <div className="container-fluid" style={{ "paddingTop": 20 }}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/pleaseconfirm" component={PleaseConfirm} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/app" component={App} />
                <Route exact path="/app/me" component={AppMe} />
                <Route exact path="/app/me/change-password" component={AppMeChangePassword} />
              </Switch>
            </div>
          </div>

          <div id="footer" style={{
            height: "60px",
            backgroundColor: "#f5f5f5"}}>
            <Footer />
          </div>
        </div>
      </Provider>
    </BrowserRouter>
  }
});
export default Main;

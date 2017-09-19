import {observable, action} from 'mobx';
import CognitoUserPool from './CognitoUserPool'
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'

class UiState {
  userInfo = observable.map(new Map())
  userAttributes = observable.map(new Map())
  loading = observable.map(new Map())

  constructor() {
    this.loginFromLocalStorage();
  }

  get user() {
    return this.userInfo && this.userInfo.get('user')
  }

  loginFromLocalStorage = action('loginFromLocalStorage', () => {
    let cognitoUser = CognitoUserPool.getCurrentUser();
    let unsetLoading = this.setLoading('login', 'Logging in from local storage');
    this.setUserInfo(cognitoUser);

    if (!this.user) {
      unsetLoading();
      return;
    }

    this.user.getSession((err, session) => {
      if (err) {
        console.log('unable to getSession, logging out');
        this.logout();
      } else {
        console.log('session validity: ' + session.isValid());
      }
      unsetLoading();
    });
    this.user.getUserAttributes((err, result) => {
      if (err) {
        console.log('unable to getUserAttributes, logging out');
        this.logout();
      } else {
        for (let i = 0; i < result.length; i++) {
          this.userAttributes.set(result[i].getName(), result[i].getValue());
        }
      }
    });
  })

  login = action('login', (username, password, callbacks) => {
    this.setLoading('login', 'Authenticating...');

    let authenticationDetails = new AuthenticationDetails({ Username: username, Password: password });
    let cognitoUser = new CognitoUser({ Username: username, Pool: CognitoUserPool });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        callbacks.onSuccess(result);
        this.loginFromLocalStorage();
        this.unsetLoading('login');
      },
      onFailure: (err) => {
        callbacks.onFailure(err);
        this.unsetLoading('login');
      },
    });
  })

  logout = action('logout', () => {
    if (this.user) {
      this.user.signOut();
      this.setUserInfo(undefined);
    }
  })

  setUserInfo = action('setUserInfo', (userInfo) => {
    this.userInfo.set('user', userInfo);
  })

  setLoading = action('setLoading', (name, message) => {
    this.loading.set(name, message);
    return () => this.unsetLoading(name)
  })

  unsetLoading = action('unsetLoading', (name) => {
    this.loading.delete(name);
  })
}

export default new UiState();

import React from 'react'
import { inject } from 'mobx-react'
import Form from 'react-jsonschema-form'
import { Link, Redirect } from 'react-router-dom'
import CognitoUserPool from './CognitoUserPool'
import { CognitoUser } from 'amazon-cognito-identity-js';

const usernameSchema = {
  title: "Request Password Reset",
  type: "object",
  required: ["username"],
  properties: {
    username: {type: "string", title: "Username", default: "" }
  }
};

const confirmationCodeSchema = {
  title: "Reset Password",
  type: "object",
  required: ["confirmation_code", "new_password", "new_password_confirm"],
  properties: {
    confirmation_code: {type: "string", title: "Confirmation Code", default: "" },
    new_password: {type: "string", title: "New Password", default: "", minLength: 8},
    new_password_confirm: {type: "string", title: "Confirm New Password", default: "", minLength: 8}
  }
};

const confirmationCodeUiSchema = {
  "old_password": { "ui:widget": "password" },
  "new_password": { "ui:widget": "password" },
  "new_password_confirm": { "ui:widget": "password" }
};

const ForgotPassword = inject('uiState')(class ForgotPassword extends React.Component {
  componentDidMount() {
    this.setState({
      usernameForm: {},
      confirmationCodeForm: {},
      step: 'username'
    });
  }

  onSubmitUsername(e) {
    this.username = e.formData.username;
    this.cognitoUser = new CognitoUser({
      Username: e.formData.username,
      Pool: CognitoUserPool,
    });

    this.props.uiState.setLoading('reset-password', 'Initiating password reset...');

    this.cognitoUser.forgotPassword({
      onSuccess: (data) => {
        this.setState({ step: 'confirmationCode' });
        this.props.uiState.unsetLoading('reset-password');
      },
      onFailure: (err) => {
        this.setState({ serverResponse: err });
        this.submitUsernameButton.click();
        this.setState({ serverResponse: undefined });
        this.props.uiState.unsetLoading('reset-password');
      }
    });
  }

  onSubmitConfirmationCode(e) {
    this.props.uiState.setLoading('reset-password', 'Confirming password reset...');
    this.cognitoUser.confirmPassword(e.formData.confirmation_code, e.formData.new_password, {
      onSuccess: () => {
        this.props.uiState.unsetLoading('reset-password');
        this.props.uiState.login(this.username, e.formData.new_password, {
          onSuccess: (data) => {
            this.setState({ step: 'finishWithLogin' });
          },
          onFailure: (err) => {
            this.setState({ step: 'finishWithoutLogin' });
          }
        });
      },
      onFailure: (err) => {
        this.setState({ serverResponse: err });
        this.submitConfirmationCodeButton.click();
        this.setState({ serverResponse: undefined });
        this.props.uiState.unsetLoading('reset-password');
      }
    });
  }

  validateUsername(formData, errors) {
    let err = this.state && this.state.serverResponse;

    if (!err) {
      // do nothing
    } else if (err.code === 'UserNotFoundException') {
      errors.username.addError('This username does not exist in our records.');
    } else {
      errors.addError(err.message);
    }

    return errors;
  }

  validateConfirmationCode(formData, errors) {
    if (formData.new_password !== formData.new_password_confirm) {
      errors.new_password_confirm.addError('New passwords must match');
    }

    let err = this.state && this.state.serverResponse;
    if (!err) {
      // do nothing
    } else if (err.code === 'CodeMismatchException') {
      errors.confirmation_code.addError('Incorrect confirmation code');
    } else {
      errors.addError(err.message);
    }

    return errors;
  }

  onChangeUsername(e) {
    Object.assign(this.state.usernameForm, e.formData);
  }

  onChangeConfirmationCode(e) {
    Object.assign(this.state.confirmationCodeForm, e.formData);
  }

  render() {
    return <div>
      { this.state && this.state.step === 'username' && this.usernameForm }
      { this.state && this.state.step === 'confirmationCode' && this.confirmationCodeForm }
      { this.state && this.state.step === 'finishWithoutLogin' && this.finishWithoutLogin }
      { this.state && this.state.step === 'finishWithLogin' && this.finishWithLogin }
    </div>
  }

  get usernameForm() {
    return <Form
      schema={usernameSchema}
      formData={this.state && this.state.usernameForm}
      onSubmit={this.onSubmitUsername.bind(this)}
      onChange={this.onChangeUsername.bind(this)}
      validate={this.validateUsername.bind(this)}
      ref={form => this.form = form}
    >
      <div className="btn-toolbar">
        <button ref={btn => this.submitUsernameButton = btn} type="submit" className="btn btn-info">Submit</button>
      </div>
    </Form>
  }

  get confirmationCodeForm() {
    return <Form
      schema={confirmationCodeSchema}
      uiSchema={confirmationCodeUiSchema}
      formData={this.state && this.state.confirmationCodeForm}
      onSubmit={this.onSubmitConfirmationCode.bind(this)}
      onChange={this.onChangeConfirmationCode.bind(this)}
      validate={this.validateConfirmationCode.bind(this)}
      ref={form => this.form = form}
    >
      Please check your email for a confirmation code to continue.
      <div className="btn-toolbar">
        <Link className="btn btn-default" to="/forgot-password">Back</Link>
        <button ref={btn => this.submitConfirmationCodeButton = btn} type="submit" className="btn btn-info">Submit</button>
      </div>
    </Form>
  }

  get finishWithoutLogin() {
    return <div>
      Your password has been reset, you may now log in.
    </div>
  }

  get finishWithLogin() {
    return <Redirect to="/app" />
  }
});

export default ForgotPassword;

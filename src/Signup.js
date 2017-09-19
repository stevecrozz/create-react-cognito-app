import React from 'react';
import { inject, observer } from 'mobx-react';
import Form from 'react-jsonschema-form';
import CognitoUserPool from './CognitoUserPool'
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { Redirect } from 'react-router-dom'

const schema = {
  title: "Signup",
  type: "object",
  required: ["email", "username", "password"],
  properties: {
    email: {type: "string", title: "Email", default: ""},
    username: {type: "string", title: "Username", default: ""},
    password: {type: "string", title: "Password", default: "", minLength: 8}
  }
};

const uiSchema = {
  "password": {
    "ui:widget": "password"
  },
  "email": {
    "ui:widget": "email"
  }
};

let formData = {};

let errorSchema = {};

const Signup = inject('uiState')(observer(class Signup extends React.Component {
  onSubmit(e) {
    this.props.uiState.setLoading('signup', 'Creating a new user...');

    let attributes = [
      new CognitoUserAttribute({ Name: 'email', Value: e.formData.email })
    ];

    CognitoUserPool.signUp(
      e.formData.username,
      e.formData.password,
      attributes,
      null,
      (err, result) => {
        if (err) {
          // the form library doesn't provide a way to display errors here, so
          // we set some state temporarily and retrigger validation through a
          // second form submission which is the only way to hook into the
          // errors API
          this.setState({ serverResponse: err });
          this.submitButton.click();
          this.setState({ serverResponse: undefined });
        } else {
          this.props.uiState.setUserInfo(result);
          this.setState({ redirectTo: '/pleaseconfirm' });
        }

        this.props.uiState.unsetLoading('signup');
      });
  }

  validate(formData, errors) {
    let err = this.state && this.state.serverResponse;

    if (!err) {
      // do nothing
    } else if (err.name === 'UsernameExistsException') {
      errors.username.addError('This username is already in use');
    } else if (err.name === 'InvalidPasswordException') {
      errors.password.addError(err.message);
    } else {
      errors.addError(err.message);
    }

    return errors;
  }

  onChange(e) {
    formData = e.formData;
  }

  render() {
    if (this.state && this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo} />
    }

    return <div>
      <Form
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        formData={formData}
        onSubmit={this.onSubmit.bind(this)}
        onChange={this.onChange.bind(this)}
        validate={this.validate.bind(this)}
        ref={form => this.form = form}
        >
        <p><button ref={btn => this.submitButton = btn} type="submit" className="btn btn-info">Submit</button></p>
      </Form>
    </div>
  }
}));

export default Signup;

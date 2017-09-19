import React from 'react'
import { inject } from 'mobx-react'
import Form from 'react-jsonschema-form'
import { Link } from 'react-router-dom'
import Alert from './Alert'

const schema = {
  title: "Change Password",
  type: "object",
  required: ["old_password", "new_password", "new_password_confirm"],
  properties: {
    old_password: {type: "string", title: "Current Password", default: "", minLength: 8},
    new_password: {type: "string", title: "New Password", default: "", minLength: 8},
    new_password_confirm: {type: "string", title: "Confirm New Password", default: "", minLength: 8}
  }
};

const uiSchema = {
  "old_password": { "ui:widget": "password" },
  "new_password": { "ui:widget": "password" },
  "new_password_confirm": { "ui:widget": "password" }
};

let errorSchema = {};

const AppMeChangePassword = inject('uiState')(class AppMeChangePassword extends React.Component {
  componentDidMount() {
    this.setState({ formData: {} });
  }

  onSubmit(e) {
    this.props.uiState.setLoading('change-password', 'Changing password...');

    this.props.uiState.user.changePassword(
      e.formData.old_password,
      e.formData.new_password,
      (err, result) => {
        if (err) {
          this.setState({ serverResponse: err });
          this.submitButton.click();
          this.setState({ serverResponse: undefined });
          this.props.uiState.unsetLoading('change-password');
        } else {
          this.setState({
            formData: {},
            successMessage: 'You have successfully changed your password.'
          });
        }
      });

    this.props.uiState.unsetLoading('change-password');
  }

  validate(formData, errors) {
    if (formData.new_password !== formData.new_password_confirm) {
      errors.new_password_confirm.addError('New passwords must match');
    }

    let err = this.state && this.state.serverResponse;
    if (!err) {
      // do nothing
    } else if (err.code === 'NotAuthorizedException') {
      errors.old_password.addError('Incorrect password');
    } else {
      errors.addError(err.message);
    }

    return errors;
  }

  onChange(e) {
    Object.assign(this.state.formData, e.formData);
  }

  render() {
    return <div>
      {
        this.state && this.state.successMessage && <Alert type="success">{this.state.successMessage}</Alert>
      }

      <Form
        schema={schema}
        uiSchema={uiSchema}
        errorSchema={errorSchema}
        formData={this.state && this.state.formData}
        onSubmit={this.onSubmit.bind(this)}
        onChange={this.onChange.bind(this)}
        validate={this.validate.bind(this)}
        ref={form => this.form = form}
      >
        <div className="btn-toolbar">
          <Link className="btn btn-default" to="/app/me">Back</Link>
          <button ref={btn => this.submitButton = btn} type="submit" className="btn btn-info">Submit</button>
        </div>
      </Form>
    </div>
  }
});

export default AppMeChangePassword;

import React from 'react'
import { inject, observer } from 'mobx-react'
import Form from 'react-jsonschema-form'
import { Redirect, Link } from 'react-router-dom'

const schema = {
  title: "Login",
  type: "object",
  required: ["username", "password"],
  properties: {
    username: {type: "string", title: "Username", default: ""},
    password: {type: "string", title: "Password", default: "", minLength: 8}
  }
};

const uiSchema = {
  "password": {
    "ui:widget": "password"
  }
};

let formData = {};

let errorSchema = {};

const Login = inject('uiState')(observer(class Login extends React.Component {
  onSubmit(e) {
    this.props.uiState.login(e.formData.username, e.formData.password, {
      onSuccess: (result) => {
        this.setState({ redirectTo: '/app' });
      },
      onFailure: (err) => {
        this.setState({ serverResponse: err });
        this.submitButton.click();
        this.setState({ serverResponse: undefined });
      },
    });
  }

  validate(formData, errors) {
    let err = this.state && this.state.serverResponse;

    if (!err) {
      // do nothing
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
        <div className="form-group">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </Form>
    </div>
  }
}));

export default Login;

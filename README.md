This is a starter application built with
[create-react-app](https://github.com/facebookincubator/create-react-app) using
mobx. It includes user registration, sign-in, email confirmation, password
change and password reset functionality via AWS Cognito. In order to use it, you'll need to provide a dotenv file with:

~~~text
REACT_APP_AWS_COGNITO_USER_POOL_ID=us-east-1_blahblah
REACT_APP_AWS_COGNITO_CLIENT_ID=blahblahblahblahblahblah
~~~

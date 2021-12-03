import { useState } from 'react';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";

import db from "../../firebase";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { Link } from "react-router-dom";

const Register = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: []
  });

  const handleChange = (e) => {
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  const isValid = () => {
    let errors = [];
    let error;

    if (isEmpty(state)) {
      error = { message: "Tous les champs doivent etre remplis" };
      setState(prevState => ({
        ...prevState,
        errors:errors.concat(error)
      }));
      return false;
    } else if (!isPasswordValid(state)) {
      error = { message: "Mot de Passe invalide" };
      setState(prevState => ({
        ...prevState,
        errors:errors.concat(error)
      }));
      return false;
    } else {
      return true;
    }
  };

  const isEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  const isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  const showErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);


  const handleSubmit = (e) => {
    if (isValid()) {
      e.preventDefault();

      const auth = getAuth(db);
      createUserWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="red" textAlign="center">
            <Icon name="rocketchat" color="red" />
            Register for rocketchat
          </Header>
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={handleChange}
                value={state.username}
                type="text"
              />

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={handleChange}
                value={state.email}
                type="email"
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={handleChange}
                value={state.password}
                type="password"
              />

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={handleChange}
                value={state.passwordConfirmation}
                type="password"
              />

              <Button color="red" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          {state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {showErrors(state.errors)}
            </Message>
          )}

          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
  )
}

export default Register;

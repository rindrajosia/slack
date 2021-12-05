import React from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from "../../Actions";
import Spinner from "../../Utils/Spinner";

import { useState, useEffect } from 'react';
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";

import firebase from "../../firebase";


import { Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading );
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
    errors: [],
    loading: false,
  });

  useEffect(() => {
    let mounted = true;

    firebase.auth().onAuthStateChanged(user => {
      if (mounted) {
        if (user) {
          dispatch(setUser(user));
          navigate("/");
        } else {
          dispatch(clearUser());
        }
      }
    });
    return () => mounted = false;
  }, [])

  const handleChange = (e) => {
    setState(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }

  const showErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>);


  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid()) {
      setState(prevState => ({
        ...prevState,
        errors: [],
        loading: true
      }));

      firebase
        .auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .then(signedInUser => {
          console.log(signedInUser);
          setState(prevState => ({
            ...prevState,
            errors: [],
            loading: false
          }));
        })
        .catch(err => {
          console.error(err);
          setState(prevState => ({
            ...prevState,
            errors: prevState.errors.concat(err),
            loading: false
          }));
        });

    }
  }


  const isValid = () => {
    let errors = [];
    let error;

    if (isEmpty(state)) {
      error = { message: "Tous les champs doivent etre remplis" };
      setState(prevState => ({
        ...prevState,
        errors: errors.concat(error)
      }));
      return false;
    }
    return true;
  };

  const isEmpty = ({ email, password }) => {
    return (
      !email.length ||
      !password.length
    );
  };

  const handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };

  console.log(state.errors)
  console.log(isLoading)
  return isLoading ? (
      <Spinner />
    ) : (
    <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="blue" textAlign="center">
            <Icon name="rocketchat" color="blue" />
            Login for rocketchat
          </Header>
          <Form size="large" onSubmit={handleSubmit}>
            <Segment stacked>

              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                onChange={handleChange}
                value={state.email}
                className={handleInputError(state.errors, "email")}
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
                className={handleInputError(state.errors, "password")}
                type="password"
              />

              <Button
                disabled={state.loading}
                className={state.loading ? "loading" : ""}
                color="blue"
                fluid
                size="large"
              >
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
            No account? <Link to="/register">Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
  )
}

export default Login;

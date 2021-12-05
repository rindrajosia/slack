import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from "../../Actions";
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
import md5 from "md5";
import Spinner from "../../Utils/Spinner";


import { Link } from "react-router-dom";

const Register = () => {
  const ref = useRef();
  const isLoading = useSelector((state) => state.user.isLoading );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref("users")
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
    } else if (!isPasswordValid(state)) {
      error = { message: "Mot de Passe invalide" };
      setState(prevState => ({
        ...prevState,
        errors: errors.concat(error)
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
    e.preventDefault();

    if (isValid()) {
      setState(prevState => ({
        ...prevState,
        errors: [],
        loading: true
      }));

      firebase
        .auth()
        .createUserWithEmailAndPassword(state.email, state.password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: state.username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              saveUser(createdUser).then(() => {
                console.log("user saved");
                setState(prevState => ({
                  ...prevState,
                  errors: [],
                  loading: false
                }));
              });
            })
            .catch(err => {
              console.error(err);
              setState(prevState => ({
                ...prevState,
                errors: prevState.errors.concat(err),
                loading: false
              }));
            });
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

  const saveUser = createdUser => {
    return state.usersRef.child(createdUser.user.uid).set({
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    });
  };

  const removeListeners = () => {
    state.usersRef.off();
  };




  const handleInputError = (errors, inputName) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? "error"
      : "";
  };


  return  isLoading ? (
      <Spinner />
    ) : (
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

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={handleChange}
                value={state.passwordConfirmation}
                className={handleInputError(state.errors, "password")}
                type="password"
              />

              <Button
                disabled={state.loading}
                className={state.loading ? "loading" : ""}
                color="orange"
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
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
  )
}

export default Register;

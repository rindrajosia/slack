import React from "react";
import { Grid } from "semantic-ui-react";
import "./App.css";
import { useDispatch, useSelector } from 'react-redux';
import firebase from "../firebase";
import { useEffect } from 'react';
import { setUser } from "../Actions";
import Spinner from "../Utils/Spinner";
import { useNavigate } from "react-router-dom";

import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading );
  const currentUser = useSelector((state) => state.user.currentUser );
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
        console.log(user);
      } else {
        navigate("/login");
      }
    });
  }, [])

  console.log(currentUser);
  const flag = currentUser == null || currentUser == undefined;
  return isLoading && flag ? (
      <Spinner />
    ) : (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel />
      <SidePanel currentUser={currentUser} />

      <Grid.Column style={{ marginLeft: 320 }}>
        <Messages />
      </Grid.Column>

      <Grid.Column width={4}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
}

export default App;

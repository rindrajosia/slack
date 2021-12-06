import React from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../firebase";
import { useDispatch } from 'react-redux';
import { clearUserList } from "../../Actions";

const UserPanel = ({ currentUser }) => {
  const dispatch = useDispatch();
  console.log(currentUser);
  const dropdownOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Signed in as <strong>{currentUser && currentUser.displayName}</strong>
        </span>
      ),
      disabled: true
    },
    {
      key: "avatar",
      text: <span>Change Avatar</span>
    },
    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign Out</span>
    }
  ];

  const handleSignout = () => {
    dispatch(clearUserList());
    firebase
      .auth()
      .signOut()
      .then(() => console.log("signed out!"));
  };

    return (
      <Grid style={{ background: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
          
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>rocketchat</Header.Content>
            </Header>

            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={currentUser.photoURL} spaced="right" avatar />
                    {currentUser && currentUser.displayName}
                  </span>}
                options={dropdownOptions()}
              />
            </Header>

          </Grid.Row>


        </Grid.Column>
      </Grid>
    );
}

export default UserPanel;

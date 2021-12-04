import React, { useState } from "react";
import firebase from "../../firebase";
import { Segment, Button, Input } from "semantic-ui-react";

const MessageForm = ({ messagesRef, currentChannel, currentUser }) => {
  console.log(currentChannel)
  const [state, setState] = useState({
    message: "",
    user: currentUser,
    loading: false,
    errors: []
  })

  const handleChange = event => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    });
  };

  const createMessage = () => {
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: state.user.uid,
        name: state.user.displayName,
        avatar: state.user.photoURL
      },
      content: state.message
    };
    return message;
  };

  const sendMessage = () => {
    console.log(state.channel);
    const { message } = state;

    if (message) {
      setState({
        ...state,
        loading: true
      });

      messagesRef
      .child(currentChannel.id)
      .push()
      .set(createMessage())
      .then(() => {
        setState({
          ...state,
          loading: false,
          message: "",
          errors: []
        });
      })
      .catch(err => {
        console.error(err);
        setState({
          ...state,
          loading: false,
          errors: state.errors.concat(err)
        });
      });
  } else {
    setState({
      ...state,
      errors: state.errors.concat({ message: "Add a message" })
    });
  }
};


    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="Write your message"
          onChange={handleChange}
          value={state.message}
          className={
            state.errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
        />
        <Button.Group icon widths="2">
          <Button
            onClick={sendMessage}
            disabled={state.loading}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
}

export default MessageForm;

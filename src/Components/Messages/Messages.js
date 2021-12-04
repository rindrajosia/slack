import React, { useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import { useSelector } from 'react-redux';
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";

const Messages = ({ currentUser }) => {
  const currentChannel = useSelector((state) => state.channel.currentChannel );
  const [state, setState] = useState({
    messagesRef: firebase.database().ref("messages"),
    channel: currentChannel,
    user: currentUser
  })

  console.log(currentChannel);
  return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">{/* Messages */}</Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={state.messagesRef}
          currentChannel={currentChannel}
          currentUser={state.user}
        />
      </React.Fragment>
    );
}

export default Messages;

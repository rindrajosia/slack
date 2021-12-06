import React, { useEffect, useState } from "react";
import { Segment, Comment } from "semantic-ui-react";
import firebase from "../../firebase";
import { useSelector } from 'react-redux';
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";

const Messages = ({ currentUser }) => {
  const currentChannel = useSelector((state) => state.channel.currentChannel );
  const [state, setState] = useState({
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true
  })



  useEffect(() => {

    if (currentChannel && currentUser) {
      console.log(currentChannel.id);
      addListeners(currentChannel.id);
    }

    return () => {
      removeListeners();
    }
// eslint-disable-next-line
  }, [currentChannel])

  const addListeners = channelId => {
    addMessageListener(channelId);
  };

  const removeListeners = () => {
    state.messagesRef.off();
  };

  const addMessageListener = channelId => {
    let loadedMessages = [];
    state.messagesRef.child(channelId).on("child_added", snap => {
      console.log(snap.key)
      loadedMessages.push(snap.val());
      console.log(loadedMessages.length)
        setState({
          ...state,
          messages: loadedMessages,
          messagesLoading: false
        });
    })

   if (loadedMessages.length === 0){
     setState({
       ...state,
       messages: [],
       messagesLoading: false
     });
   }


  };

const displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={currentUser}
      />
    ));


  return (
      <React.Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">
            {state.messages && displayMessages(state.messages)}
          </Comment.Group>
        </Segment>

        <MessageForm
          messagesRef={state.messagesRef}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </React.Fragment>
    );
}

export default Messages;

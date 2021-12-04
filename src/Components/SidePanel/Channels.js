import React from "react";
import firebase from "../../firebase";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { useEffect, useState } from 'react';

const Channels = ({ currentUser }) => {
  const [state, setState] = useState({
    user: currentUser,
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref("channels"),
    modal: false,
  })

  useEffect(() => {
    addListeners();
  }, [])

  const addListeners = () => {
    let loadedChannels = [];
    state.channelsRef.on("child_added", snap => {
      loadedChannels.push(snap.val());
      setState((prevState) => (
       {
         ...prevState,
         channels: loadedChannels
       }
     ));
    });
  };

  const handleChange = event => {
    setState((prevState) => (
     {
       ...prevState,
       [event.target.name]: event.target.value
     }
   ));
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (isFormValid(state)) {
      addChannel();
    }
  };

  const displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => console.log(channel)}
        name={channel.name}
        style={{ opacity: 0.7 }}
      >
        # {channel.name}
      </Menu.Item>
    ));


  const addChannel = () => {
    const { channelsRef, channelName, channelDetails, user } = state;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setState((prevState) => (
         {
           ...prevState,
           channelName: "",
           channelDetails: "",
         }
       ));
        closeModal();
        console.log("channel added");
      })
      .catch(err => {
        console.error(err);
      });
  };

  const openModal = () => setState((prevState) => (
    {
      ...prevState,
      modal: true
    }
  ));

  const closeModal = () => setState((prevState) => (
    {
      ...prevState,
      modal: false
    }
  ));

  const isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({state.channels.length}) <Icon name="add" onClick={openModal} />
          </Menu.Item>
          {displayChannels(state.channels)}
        </Menu.Menu>

        {/* Add Channel Modal */}
        <Modal basic open={state.modal} onClose={closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={handleChange}
                />
              </Form.Field>

              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>

          <Modal.Actions>
            <Button color="green" inverted onClick={handleSubmit} >
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
}

export default Channels;

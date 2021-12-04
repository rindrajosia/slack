import React from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import { useState } from 'react';

const Channels = () => {
  const [state, setState] = useState({
    channels: [],
    channelName: "",
    channelDetails: "",
    modal: false,
  })


  const handleChange = event => {
    setState({ [event.target.name]: event.target.value });
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

    return (
      <React.Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({state.channels.length}) <Icon name="add" onClick={openModal} />
          </Menu.Item>
          {/* Channels */}
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
            <Button color="green" inverted>
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

import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import firebase from "../../firebase";
import { useDispatch } from 'react-redux';
import { setUserList, setCurrentChannel, setPrivateChannel } from "../../Actions";

const DirectMessages = ({ currentUser }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    activeChannel: "",
    users: [],
    usersRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence")
  })



  useEffect(() => {
    addListeners(currentUser.uid);
    // eslint-disable-next-line
  }, []);


  const addListeners = currentUserUid => {
    let loadedUsers = [];
    console.log(currentUserUid);

    state.usersRef.on("child_added", snap => {
      console.log(snap.val());
      if (currentUserUid !== snap.key) {
        let user = snap.val();
        user["uid"] = snap.key;
        user["status"] = "offline";
        loadedUsers.push(user);
        setState({
          ...state,
          users: loadedUsers
        });
        dispatch(setUserList(loadedUsers));
      }
    });




    state.connectedRef.on("value", snap => {
      if (snap.val() === true) {
        const ref = state.presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(err => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

  };


  const changeChannel = user => {
    const channelId = getChannelId(user.uid);
    const channelData = {
      id: channelId,
      name: user.name
    };
   dispatch(setCurrentChannel(channelData));
   dispatch(setPrivateChannel(true));
   setActiveChannel(user.uid);
 };

 const getChannelId = userId => {
   const currentUserId = currentUser.uid;
   return userId < currentUserId
     ? `${userId}/${currentUserId}`
     : `${currentUserId}/${userId}`;
 };

 const setActiveChannel = userId => {
    setState({
      ...state,
      activeChannel: userId
    });
  };


    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{' '}
          ({ state.users.length })
        </Menu.Item>

        {state.users.length > 0 && state.users.map(user => (
          <Menu.Item
            key={user.uid}
            active={user.uid === state.activeChannel}
            onClick={() => changeChannel(user)}
            style={{ opacity: 0.7, fontStyle: "italic" }}
          >
            <Icon
              name="spy"
              color= "grey"
            />
            @ {user.name}
          </Menu.Item>
        ))}

      </Menu.Menu>
    )
}

export default DirectMessages;

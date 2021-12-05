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
    if (currentUser) {
      addListeners(currentUser.uid);
    }

    return () => {
      removeListeners();
    }
  }, [currentUser])

  const removeListeners = () => {
    state.usersRef.off();
  };

  const addListeners = currentUserUid => {
    let loadedUsers = [];

    state.usersRef.on("child_added", snap => {
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

    state.presenceRef.on("child_added", snap => {
      if (currentUserUid !== snap.key) {
        addStatusToUser(snap.key);
      }
    });

    state.presenceRef.on("child_removed", snap => {
      if (currentUserUid !== snap.key) {
        addStatusToUser(snap.key, false);
      }
    });
  };

  const addStatusToUser = (userId, connected = true) => {
    const updatedUsers = state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);

    setState({
      ...state,
      users: updatedUsers
    });
  };

  const isUserOnline = user => user.status === "online";

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
              name="circle"
              color= {isUserOnline(user) ? "green" : "red"}
            />
            @ {user.name}
          </Menu.Item>
        ))}

      </Menu.Menu>
    )
}

export default DirectMessages;

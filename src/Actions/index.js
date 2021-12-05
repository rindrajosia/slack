import * as actionTypes from "./types";

export const setUser = user => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user
    }
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER
  };
};

export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  }
}

export const setPrivateChannel = isPrivateChannel => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivateChannel
    }
  };
};



export const setUserList = users => {
  return {
    type: actionTypes.SET_USER_LIST,
    payload: {
      userList: users
    }
  }
}

export const clearUserList = users => {
  return {
    type: actionTypes.CLEAR_USER_LIST
  }
}

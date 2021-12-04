import React, { useState } from 'react';
import { Menu, Icon } from 'semantic-ui-react';

const DirectMessages = () => {
  const [state, setState] = useState({users: []})


    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> DIRECT MESSAGES
          </span>{' '}
          ({ state.users.length })
        </Menu.Item>
        {/* Users to Send Direct Messages */}
      </Menu.Menu>
    )
}

export default DirectMessages;

import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import WifiIcon from '@mui/icons-material/Wifi';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function SwitchListSecondary({ tabs, openAndRemoveTab, removeTab }) {
  console.log('[SwitchListSecondary] tabs count=', tabs.length);

  const [checked, setChecked] = React.useState(['wifi']);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const createListItem = () => {
    const list = tabs.map((tab, index) => (
      <ListItem
        divider
      >
        <ListItemIcon>
          <WifiIcon />
        </ListItemIcon>
        <ListItemText
          id={`tab-${index}`}
          primary={tab.title}
          onClick={(event) => { openAndRemoveTab(event, index); }}
        />
        <IconButton
          aria-label="delete"
          color="error"
          onClick={() => { removeTab(index); }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    ));
    return list;
  };

  return (
    <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      subheader={<ListSubheader>Settings</ListSubheader>}
    >
      {createListItem()}
    </List>
  );
}

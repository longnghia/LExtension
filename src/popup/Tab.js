import DeleteIcon from '@mui/icons-material/Delete';
import WifiIcon from '@mui/icons-material/Wifi';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  func, number, string,
} from 'prop-types';
import React from 'react';
import { getIcon } from '../utils';
import './style.css';

Tab.propTypes = {
  tab: { title: string, url: string, date: string }.isRequired,
  index: number.isRequired,
  onClick: func.isRequired,
  onClickDelete: func.isRequired,
  key: string.isRequired,
};

function Tab({
  tab, index, onClick, onClickDelete, key,
}) {
  const [removing, setRemoving] = React.useState(false);
  const classes = `data${removing ? ' removing' : ''}`;

  const deleteTab = () => {
    setRemoving(true);
    setTimeout(() => {
      onClickDelete(index);
    }, 500);
  };

  const openAndRemoveTab = () => {
    onClick(index);
  };

  const icon = getIcon(tab.url);
  return (
    <ListItem
      divider
      className={classes}
      key={key}
    >
      <ListItemIcon>
        {icon
          ? (
            <img
              width={16}
              height={16}
              src={icon}
              loading="lazy"
              alt="tab favicon"
            />
          )
          : <WifiIcon />}
      </ListItemIcon>
      <ListItemText
        id={`tab-${index}`}
        primary={tab.title}
        onClick={openAndRemoveTab}
      />
      <IconButton
        aria-label="delete"
        color="error"
        onClick={deleteTab}
      >
        <DeleteIcon />
      </IconButton>
    </ListItem>
  );
}

export default Tab;

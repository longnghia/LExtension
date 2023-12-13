import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import {
  arrayOf, func, shape, string,
} from 'prop-types';
import * as React from 'react';
import { hashCode } from '../utils';
import Tab from './Tab';

SwitchListSecondary.propTypes = {
  tabs: arrayOf(
    shape({ title: string, url: string, date: string }),
  ).isRequired,
  openAndRemoveTab: func.isRequired,
  removeTab: func.isRequired,
};

export default function SwitchListSecondary({ tabs, openAndRemoveTab, removeTab }) {
  const [checked, setChecked] = React.useState(['wifi']);

  // TODO: bulk remove
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

  const onClick = React.useCallback(
    (event, index) => {
      openAndRemoveTab(event, index);
    },
    [openAndRemoveTab],
  );

  const onClickDelete = React.useCallback(
    (index) => { removeTab(index); },
    [removeTab],
  );

  const createListItem = () => {
    const list = tabs.map((tab, index) => {
      const key = hashCode(tab.url);
      return (
        <Tab {...{
          tab, index, onClick, onClickDelete, key,
        }}
        />
      );
    });
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

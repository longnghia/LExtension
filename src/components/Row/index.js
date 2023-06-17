import React from 'react';
import { Switch, IconButton, TextareaAutosize } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import './style.css';

Row.propTypes = {
  hook: { src: PropTypes.string, des: PropTypes.string, active: PropTypes.bool },
  removeHook: PropTypes.func,
  visible: PropTypes.bool,
};

Row.defaultProps = {
  hook: {},
  removeHook: () => { },
  visible: true,
};

export default function Row({
  hook, removeHook, visible,
}) {
  const { src, des, active: defaultActive } = hook;

  const [active, setActive] = React.useState(defaultActive);
  const [removing, setRemoving] = React.useState(false);

  const onClickRemoveHook = () => {
    setRemoving(true);
    setTimeout(() => {
      removeHook(hook);
    }, 500);
  };

  const toggleActive = () => {
    setActive(!active);
  };
  console.log('[row]', src, des, defaultActive);
  const classes = `data${removing ? ' removing' : ''}${(!visible && src.startsWith('__')) ? ' hidden' : ''}`;
  return (
    <div className={classes}>
      <TextareaAutosize className="data-src no-resize no-border" contentEditable="true">{src}</TextareaAutosize>
      <TextareaAutosize className="data-des no-resize no-border" contentEditable="true">{des}</TextareaAutosize>
      <Switch className="data-active" checked={active} onChange={toggleActive} />
      <IconButton
        className="data-remove"
        onClick={onClickRemoveHook}
        aria-label="delete"
        disabled={removing}
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
}

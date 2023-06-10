import React from 'react';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import './style.css';

Row.propTypes = {
  hook: {},
  removeHook: PropTypes.func,
};

Row.defaultProps = {
  hook: {},
  removeHook: () => { },
};

export default function Row({
  hook, removeHook,
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
  return (
    <div className={removing ? 'data removing' : 'data'}>
      <div className="data-src" contentEditable="true">{src}</div>
      <div className="data-des" contentEditable="true">{des}</div>
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

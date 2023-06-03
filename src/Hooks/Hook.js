import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { v4 as uuidv4 } from 'uuid';
import './style.css';
import { Switch, Tooltip } from '@mui/material';
import HookRow from './HookRow';
import { DBKey } from '../Database';
import { getValue, setValue } from '../Storage';
import { openLink } from '../Tabs';
import { LocalStorage } from '../Const';
import toast from '../Toast';

function Hook() {
  const hookLogging = LocalStorage.HOOK.logging;
  const hookEnabled = LocalStorage.HOOK.enabled;
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [hooks, setHooks] = useState([]);
  const [db, setDb] = useState({});
  const dbKey = DBKey.hooks;

  useEffect(() => {
    getHooks();
    setLogging(localStorage[hookLogging] ? JSON.parse(localStorage[hookLogging]) : false);
    setEnabled(localStorage[hookEnabled] ? JSON.parse(localStorage[hookEnabled]) : false);
    setShortcuts();
  }, []);

  useEffect(() => {
    console.log('[hook]', db);
  }, [db]);
  const openPage = function (event) {
    console.log(event.target);
  };
  async function getHooks() {
    const storage = await getValue();
    console.log('[getHooks]', storage[dbKey]);
    setLoading(false);
    if (storage[dbKey]) {
      setDb(storage);
      setHooks(storage[dbKey]);
    }
  }
  const onClickSubmitButton = () => {
    const hookEles = document.getElementsByClassName('hook');
    const newHooks = [];
    for (let i = 0; i < hookEles.length; i += 1) {
      const hookEle = hookEles[i];
      const hookSrc = hookEle.querySelector('.hook-src');
      const hookDes = hookEle.querySelector('.hook-des');
      const hookActive = hookEle.querySelector('.hook-active input');

      const hook = {
        src: hookSrc.textContent.trim(),
        des: hookDes.textContent.trim(),
        active: hookActive.checked,
      };
      if (hook.src && hook.des) { newHooks.push(hook); }
    }
    const tmpDb = { ...db };
    tmpDb[dbKey] = newHooks;

    setDb(tmpDb);
    setValue(tmpDb).then((res) => console.log(res)).catch((err) => console.log('error', err));

    setHooks(newHooks);

    toast('Saved!');
  };

  const onClickAddButton = () => {
    const newHook = { src: '', des: '', active: true };
    setHooks([newHook, ...hooks]);
  };

  const removeHook = (hook) => {
    const updatedHooks = hooks.filter((item) => item !== hook);
    setHooks(updatedHooks);
  };

  const toggleLog = () => {
    localStorage[hookLogging] = `${!logging}`;
    setLogging(!logging);
  };

  const toggleEnabled = () => {
    localStorage[hookEnabled] = `${!enabled}`;
    setEnabled(!enabled);
    // chrome.browserAction.setIcon({
    //   path: enabled ? "../icon/icons8-hook-100-color.png" : "../icon/icons8-hook-100.png"
    // });
  };

  function setShortcuts() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 's':
          if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            onClickSubmitButton();
          }
          break;

        default:
          break;
      }
    }, false);
  }
  return (
    <>
      <div id="toolbox">
        <div>
          <Tooltip title="Add">
            <IconButton
              className="hook-remove"
              id="submit"
              onClick={onClickAddButton}
              color="primary"
            >
              <AddIcon label />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">

            <IconButton
              onClick={onClickSubmitButton}
              color="primary"
            >
              <SaveAsIcon />
            </IconButton>
          </Tooltip>
        </div>
        <div>

          <span>
            Logging:
            <Tooltip title="Log">
              <Switch onChange={toggleLog} checked={logging} />
            </Tooltip>
          </span>
          <span>
            Enabled:
            <Tooltip title="Enabled">
              <Switch onChange={toggleEnabled} checked={enabled} />
            </Tooltip>
          </span>
        </div>
      </div>

      <div id="hooks-container">
        {
          hooks.map((hook) => (
            <HookRow
              hook={hook}
              key={uuidv4()}
              removeHook={removeHook}
            />
          ))
        }
      </div>
    </>
  );
}

ReactDOM.render(<Hook />, document.getElementById('hook'));

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
import { getValue, setValue, putSetting } from '../Storage';
import toast from '../Toast';

function Hook() {
  const [loading, setLoading] = useState(true);
  const [hooks, setHooks] = useState([]);
  const [db, setDb] = useState({});
  const [settings, setSettings] = useState({});
  const dbName = DBKey.hooks;

  useEffect(() => {
    getHooks();
    setShortcuts();
  }, []);

  useEffect(() => {
    putSetting({ hook: settings });
    console.log('[settings', settings);
  }, [settings]);

  async function getHooks() {
    const storage = await getValue();
    console.log('[getHooks]', storage[dbName]);
    setLoading(false);
    if (storage[dbName]) {
      setDb(storage);
      setHooks(storage[dbName]);
      setSettings(storage?.settings?.hook ?? {});
    }
  }
  const onSaveAll = () => {
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
    tmpDb[dbName] = newHooks;

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
    setSettings({ ...settings, logging: !settings.logging });
  };

  const toggleEnabled = () => {
    setSettings({ ...settings, active: !settings.active });
  };

  function setShortcuts() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 's':
          if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) {
            e.preventDefault();
            onSaveAll();
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
              onClick={onSaveAll}
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
              <Switch onChange={toggleLog} checked={settings.logging} />
            </Tooltip>
          </span>
          <span>
            Enabled:
            <Tooltip title="Enabled">
              <Switch onChange={toggleEnabled} checked={settings.active} />
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

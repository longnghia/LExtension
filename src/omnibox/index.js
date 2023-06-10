import React, { Fragment, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from '@mui/material';
import Row from '../components/Row';
import { DBKey } from '../Database';
import { getValue, setValue } from '../Storage';
import toast from '../Toast';

function Omnibox() {
  const [omniboxs, setOmniboxs] = useState([]);
  const dbName = DBKey.omniboxs;

  useEffect(() => {
    getOmniboxs();
    setShortcuts();
  }, []);

  async function getOmniboxs() {
    const storage = await getValue();
    console.log('[getOmniboxs]', storage[dbName]);
    if (storage[dbName]) {
      setOmniboxs(storage[dbName]);
    }
  }
  const onSaveAll = () => {
    const omniboxEles = document.getElementsByClassName('data');
    const newOmniboxs = [];
    for (let i = 0; i < omniboxEles.length; i += 1) {
      const omniboxEle = omniboxEles[i];
      const omniboxSrc = omniboxEle.querySelector('.data-src');
      const omniboxDes = omniboxEle.querySelector('.data-des');
      const omniboxActive = omniboxEle.querySelector('.data-active input');

      const omnibox = {
        src: omniboxSrc.textContent.trim(),
        des: omniboxDes.textContent.trim(),
        active: omniboxActive.checked,
      };
      if (omnibox.src && omnibox.des) { newOmniboxs.push(omnibox); }
    }
    setValue({ [dbName]: newOmniboxs })
      .then((res) => console.log(res))
      .catch((err) => console.log('error', err));

    setOmniboxs(newOmniboxs);

    toast('Saved!');
  };

  const onClickAddButton = () => {
    const newOmnibox = { src: '', des: '', active: true };
    setOmniboxs([newOmnibox, ...omniboxs]);
  };

  const removeOmnibox = (omnibox) => {
    const updatedOmniboxs = omniboxs.filter((item) => item !== omnibox);
    setOmniboxs(updatedOmniboxs);
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
              className="omnibox-remove"
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
      </div>

      <div id="omniboxs-container">
        {
                    omniboxs.map((omnibox) => (
                      <Row
                        hook={omnibox}
                        key={uuidv4()}
                        removeHook={removeOmnibox}
                      />
                    ))
                }
      </div>
    </>
  );
}

ReactDOM.render(<Omnibox />, document.getElementById('omnibox'));

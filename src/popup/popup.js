import React, { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { setBadge } from '../Badge';
import { Empty } from '../components';
import { DBKey } from '../Database';
import { getValue, setValue } from '../Storage';
import { openLink } from '../Tabs';
import PrimarySearchAppBar from './SearchBar';
import SwitchListSecondary from './SwitchListSecondary';

function Popup() {
  const [tabs, setTabs] = useState([]);
  const [query, setQuery] = useState('');

  const dbName = DBKey.readlater;

  useEffect(() => {
    async function getTabs() {
      const storage = await getValue();
      console.log('[getTabs]', storage[dbName]);
      if (storage[dbName]) {
        setTabs(storage[dbName]);
      }
    }
    getTabs();
  }, []);

  const updateBadge = (number) => {
    setBadge(String(number));
  };

  const setStorageAndUpdateBadge = (newTabs) => {
    setValue({
      [dbName]: newTabs,
    }).then(() => {
      console.log('$popup, setStorageAndUpdateBadge success', newTabs.length);
      updateBadge(newTabs.length);
    })
      .catch((error) => {
        console.log('$error', error);
      });
  };

  const removeTab = (pos) => {
    const realPos = (tabs.length - 1) - pos;
    if (realPos < 0 || realPos >= tabs.length) {
      console.log('$popup invalid realpos', realPos);
      return;
    }
    const item = tabs[realPos];
    const newTabs = tabs.filter((tab) => tab !== item);
    console.log('$popup removing tab', item);

    setTabs(newTabs);

    getValue().then((storage) => {
      const db = storage[dbName].filter((tab) => tab.url !== item.url);
      setStorageAndUpdateBadge(db);
    });
  };

  const reversedTabs = tabs.slice(0).reverse();

  const openAndRemoveTab = (event, index) => {
    openLink(reversedTabs[index].url);
    if (event.altKey || event.metaKey) {
      removeTab(index);
    }
  };

  const queryTab = (tab) => tab.url.toLowerCase().indexOf(query) !== -1
    || tab.title.toLowerCase().indexOf(query) !== -1;

  useEffect(() => {
    const queryStorage = async () => {
      console.log('query', query);
      const storage = await getValue();
      let db;
      if (query === '') {
        db = storage[dbName];
      } else {
        db = storage[dbName].filter((tab) => queryTab(tab, query));
      }
      console.log('count', db.length);
      setTabs(db);
    };
    const timeout = setTimeout(() => {
      queryStorage();
    }, 800);
    return () => clearTimeout(timeout);
  }, [query]);

  const onChangeQuery = useCallback((event) => setQuery(event.target.value), []);

  return (
    <div>
      <PrimarySearchAppBar onChange={onChangeQuery} />
      {
        tabs.length ? (
          <SwitchListSecondary
            tabs={reversedTabs}
            openAndRemoveTab={openAndRemoveTab}
            removeTab={removeTab}
          />
        )
          : <Empty />
      }

    </div>
  );
}

ReactDOM.render(<Popup />, document.getElementById('popup'));

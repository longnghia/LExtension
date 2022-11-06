"use strict";

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import PrimarySearchAppBar from './SearchBar'
import SwitchListSecondary from './SwitchListSecondary'
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { openLink } from './Tabs'

class Popup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tabs: [],
      query: ""
    };

    this.log(`reading database...`);
    this.getTabs()

    this.timer = null;
    this.arg = "hello"
  }

  log = function (str, param) {
    param ? console.log(`${"[Popup]"} ${str}`, param) : console.log(`${"[Popup]"} ${str}`)
  }

  openPage = function (event) {
    console.log(event.target)
  }

  getTabs = function () {
    browser.storage.local.get().then(storage => {
      this.setState({ loading: false })
      if (storage["read-later"]) {
        this.setState({ tabs: storage["read-later"] })
        this.log(`tabs=`, this.state.tabs);
      }
    });
  }

  // createSkeleton = () => {
  //   return [...Array(10).keys()].map(_ => (
  //     <Skeleton
  //       animation="wave"
  //       height={10}
  //       width="100%"
  //       style={{ marginBottom: 6 }}
  //     />
  //   ))
  // }

  removeTab = (pos) => {
    let item = this.state.tabs[pos]
    let newTabs = this.state.tabs.filter(function (tab) {
      return tab != item
    })
    this.log("removing ...", item)

    this.setState({
      tabs: newTabs
    });

    browser.storage.local.get().then(storage => {
      let db = storage["read-later"].filter(tab => tab.url != item.url)
      this.setStorageAndUpdateBadge(db)
    })
  }

  openAndRemoveTab = (event, index) => {

    openLink(this.state.tabs[index].url)
    if (event.altKey || event.metaKey) {
      this.removeTab(index)
    }
  }

  setStorageAndUpdateBadge(newTabs) {
    browser.storage.local.set({
      "read-later": newTabs
    }).then(() => {
      this.log("set storage success", newTabs.length)
      this.updateBadge(newTabs.length)
    }, this.onError)
  }

  updateBadge = (number) => {
    browser.browserAction.setBadgeText({ text: String(number) });
  }

  onError = (error) => {
    this.log("Error:", error)
  }

  onQuery = (event) => {
    let query = event.target.value

    this.timer && clearTimeout(this.timer)

    this.timer = setTimeout(() => {
      console.log(query)
      this.setState({ query })

      this.queryStorage.call(this, query)
    }, 800);
  }

  queryStorage(query) {
    console.log("this", this)
    console.log("query", query)
    browser.storage.local.get().then(storage => {
      console.log("this", this)
      let db
      if (query == "") {
        db = storage["read-later"]
      } else {
        db = storage["read-later"].filter(tab => {
          return this.queryTab(tab, query)
        })
      }
      this.log("count", db.length)
      this.setState({ tabs: db })
    })
  }

  queryTab(tab, query) {
    return tab.url.toLowerCase().indexOf(query) != -1 ||
      tab.title.toLowerCase().indexOf(query) != -1
  }

  render() {
    return (
      <div>
        <PrimarySearchAppBar onQuery={this.onQuery} />

        <SwitchListSecondary
          tabs={this.state.tabs.reverse()}
          openAndRemoveTab={this.openAndRemoveTab}
          removeTab={this.removeTab}
        />

      </div>
    );
  }
}

ReactDOM.render(<Popup />, document.getElementById('popup'));

"use strict";

import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { openLink } from '../Tabs'
import { getValue, setValue } from "../Storage"
import { DBKey } from "../Database"
import HookRow from "./HookRow"
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import TrafficIcon from '@mui/icons-material/Traffic';
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid';
import "./style.css"

class Hook extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      db: {},
      loading: true,
      hooks: [],
      logging: false
    };

    this.dbKey = DBKey.hooks
    this.log(`reading database...`);
    this.getHooks()
  }

  log = function (str, param) {
    param ? console.log(`${"[Hook]"} ${str}`, param) : console.log(`${"[Hook]"} ${str}`)
  }

  openPage = function (event) {
    console.log(event.target)
  }

  getHooks = function () {
    getValue().then(storage => {
      this.setState({ loading: false })
      if (storage[this.dbKey]) {
        this.setState({ db: storage })
        this.setState({ hooks: storage[this.dbKey] })
        this.log(`hooks=`, this.state.hooks);
      }
    });
  }


  openAndRemoveTab = (event, index) => {
    openLink(this.state.hooks[index].url)
    if (event.altKey || event.metaKey) {
      this.removeHook(index)
    }
  }

  onError = (error) => {
    this.log("Error:", error)
  }

  queryTab(tab, query) {
    return tab.url.toLowerCase().indexOf(query) != -1 ||
      tab.title.toLowerCase().indexOf(query) != -1
  }

  onClickSubmitButton() {
    let hooks = document.getElementsByClassName("hook");
    let newHooks = []
    for (let i = 0; i < hooks.length; i++) {
      let hookSrc = hooks[i].querySelector(".hook-src")
      let hookDes = hooks[i].querySelector(".hook-des")
      let hookActive = hooks[i].querySelector(".hook-active input")

      let hook = {
        src: hookSrc.textContent,
        des: hookDes.textContent,
        active: hookActive.checked
      }
      newHooks.push(hook)
    }
    let tmpDb = { ...this.state.db }
    tmpDb[this.dbKey] = newHooks

    this.setState({ db: tmpDb }, function () {
      setValue(this.state.db).then(res => console.log(res))
    })
    this.setState({ hooks: newHooks })

    this.setToast("[hook] Saved!")
  }


  onClickAddButton() {
    let newHook = { src: "", des: "", active: true }
    this.setState({ hooks: [newHook, ...this.state.hooks] })
  }


  setToast(text, timeout = 1500) {
    var Toast = Swal.mixin({
      toast: true,
      position: 'start-end',
      showConfirmButton: false,
      timer: timeout,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      customClass: {
        container: 'swal2-small',
      },
      icon: 'success',
      title: text
    })
  }

  removeHook(hook) {
    const updatedHooks = this.state.hooks.filter(item => item != hook);
    this.setState({ hooks: updatedHooks });
  }

  toggleLog(){
    this.setState({logging: !this.state.logging})
    localStorage['enabledLog'] = `${this.state.logging}`
  }

  render() {
    return (
      <Fragment>
        <div id='toolbox'>
          <IconButton
            className='hook-remove'
            id='submit'
            onClick={this.onClickAddButton.bind(this)}
            aria-label="delete"
            color="primary">
            <AddIcon />
          </IconButton>
          <IconButton
            id='add'
            onClick={this.onClickSubmitButton.bind(this)}
            aria-label="delete"
            color="primary">
            <SaveAsIcon />
          </IconButton>
          <IconButton
            id='log'
            onClick={this.toggleLog.bind(this)}
            aria-label="delete"
            color={this.state.logging ? "primary" : "secondary"}>
            <SaveAsIcon />
          </IconButton>
        </div>

        <div id="hooks-container">
          {
            this.state.hooks.map((hook, index) => (
              <HookRow
                hook={hook}
                key={uuidv4()}
                removeHook={this.removeHook.bind(this)} 
                />
            ))
          }
        </div>
      </Fragment>
    );
  }
}

ReactDOM.render(<Hook />, document.getElementById('hook'));

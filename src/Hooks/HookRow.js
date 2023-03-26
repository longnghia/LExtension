import React, { Fragment } from 'react';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function HookRow({ hook, removeHook }) {
    var { src, des, active: defaultActive } = hook
    
    const [active, setActive] = React.useState(defaultActive);
    const [removing, setRemoving] = React.useState(false);
    console.log("[row]",hook.src,removing)

    const onClickRemoveHook = () => {
        setRemoving(true)
        setTimeout(() => {
            removeHook(hook)
        }, 500);
        // container && hookRow.addEventListener("animationend", function () {});
    }

    const toggleActive = () => {
        setActive(!active)
    }
    console.log("[row]", src, des, defaultActive)
    return (
        <div className={removing ? "hook removing" : "hook"}>
            <div className="hook-src" contenteditable="true">{src}</div>
            <div className="hook-des" contenteditable="true">{des}</div>
            <Switch className='hook-active' checked={active} onChange={toggleActive} />
            <IconButton
                className='hook-remove'
                onClick={onClickRemoveHook}
                aria-label="delete"
                disabled={removing}
                color="error">
                <DeleteIcon />
            </IconButton>
        </div>
    )
}


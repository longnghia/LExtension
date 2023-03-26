import { getValue, setValue } from "../Storage"

var db = { hooks: [] }

let submitBtn, toast, addBtn, hooksContainer

submitBtn = document.getElementById("submit")
toast = document.getElementById("toast")
addBtn = document.getElementById("add")
hooksContainer = document.getElementById("hooks-container")

getValue().then(data => {
    db = data
    initHooks()

    submitBtn.addEventListener("click", savehooks)
    addBtn.addEventListener("click", addHook)

    hookRemoveListener()
})

/* 
shortcuts
ctrl s: save
*/
window.addEventListener("keydown",
    function (event) {
        if (event.ctrlKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    savehooks();
                    break;
                case 'd':
                    event.preventDefault();
                    addHook("focus");
                    break;
                default:
                    return;
            }
        }
    }, true
);

function initHooks() {
    console.log("[hook] initHooks", db)
    if (!db.hooks.length) {
        console.log("[hook] empty db.")
        return
    }
    for (let i = db.hooks.length - 1; i >= 0; i--) {
        addHook(null, db.hooks[i]["src"], db.hooks[i]["des"], db.hooks[i]["active"]) //event=null
    }
}

function hookRemoveListener() {
    let hooksRemove = document.getElementsByClassName("hook-remove")
    for (let i = 0; i < hooksRemove.length; i++) {
        let hookRemove = hooksRemove[i]
        hookRemove.addEventListener("click", function removeHook(event) {
            console.log("[hookRemove] removed hook " + i);
            hooksContainer.removeChild(hookRemove.parentNode)
        })
    }
}


function savehooks(event) {
    let hooks = document.getElementsByClassName("hook");
    let newHooks = []
    for (let i = 0; i < hooks.length; i++) {
        let hookSrc = hooks[i].querySelector(".hook-src")
        let hookDes = hooks[i].querySelector(".hook-des")
        let hookActive = hooks[i].querySelector(".hook-active input")
        let curTarget = {
            "target": hookDes.textContent,
            "active": hookActive.checked
        }
        let hook = {
            src: hookSrc.textContent,
            des: hookDes.textContent,
            active: hookActive.checked
        }

        newHooks.push(hook)
    }
    console.log("[new db]", newHooks);
    db.hooks = newHooks,
        chrome.storage.local.clear(function () {
            if (chrome.runtime.lastError) {
                setToast("Save failed!!", 2000)
            } else {
                setValue(db).then(res => console.log(res))

                chrome.runtime.sendMessage({
                    action: 'SAVE_HOOKS',
                    payload: db
                })

                setToast("saved!")
            }
        })

}

function removeHook(key) {
    let hooks = db.hooks.filter(hook => hook.src != key)
    db.hooks = hooks

    setValue(db).then(res => console.log(res))

}

function setToast(text, timeout = 1500) {
    toast.textContent = text
    setTimeout(() => {
        toast.textContent = ""
    }, timeout);
}

function addHook(event, hookSrc = "", hookDes = "", active = true) {
    let input = active ? `<input type="checkbox" checked>` : `<input type="checkbox">`
    let html = `        <div class="hook">
    <div class="hook-src" contenteditable="true">${hookSrc}</div>
    <div class="hook-des" contenteditable="true">${hookDes}</div>
    <label class="hook-active">
      ${input}
      <span class="slider round"></span>
    </label>
    <button class="hook-remove"><i class="fa fa-trash"></i></button>
    </div>`
    hooksContainer.insertAdjacentHTML("afterbegin", html)
    hooksContainer.querySelector(".hook-remove").addEventListener("click", function removeHook(event) {
        console.log("[hookRemove] removed hook ");
        hooksContainer.removeChild(this.parentNode)
    })
    if (event) hooksContainer.querySelector("div.hook-src").focus()
}

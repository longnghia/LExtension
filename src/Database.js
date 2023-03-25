let defaultDB =
{
    background : [
        "mylivewallpapers.com-Yellow-Space-Suit-Girl.webm"
    ],
    collection: [
        "https://github.dev"
    ],
    omniboxs: [
        {
            "src": "ios",
            "des": "https://github.com/search?o=desc&q=stars%3A%3E%3D20+fork%3Atrue+language%3Aswift&s=updated&type=Repositories"
        }
    ],
    "read-later": [],
    readlater:[],
    hooks: [
        {
            "active": true,
            "des": "http://localhost/assests/hello.html",
            "src": "https://wttr.in/hanoi"
        },
    ],
}

export let DBKey = {
    hooks: "hooks",
    readlater: "read-later",
    background: "background",
    omniboxs: "omniboxs",
    collection: "collection"
}

export default defaultDB;
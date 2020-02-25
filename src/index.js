import "./index.css";

import search, { init as initSearch } from "./components/search";

function init() {
    let markup = search();
    document.getElementById(`app`).insertAdjacentHTML(`beforeend`,markup);

    initSearch();
}

init();

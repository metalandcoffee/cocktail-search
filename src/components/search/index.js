import "./index.css";

import { state, setState } from "../../state";
import { fetchDrinksByName, fetchDrinksByIngredient } from "../../data";
import lightbox, { init as initLightbox, clearLightbox } from "../lightbox";

export function init() {
    const search = document.getElementById(`search`);
    search.addEventListener(`submit`, doSearch);
}

export default function search() {
    return `
        <h1>Find Your Cocktail 🍸</h1>
        <form name="search" id="search">
            <p><label for="search-field">Enter Search Term Below:</label></p>
            <input id="search-field" name="search-term" type="search" />
            <select id="search-select" name="search-type">
                <option value="name">By Cocktail Name</option>
                <option value="ingredient">By Ingredient</option>
            </select>
            <input type="submit" id="submit" value="Search Cocktails" />
        </form>
    `;
}

async function doSearch(e) {
    e.preventDefault();
    clearLightbox();

    const term = document.getElementById(`search-field`).value.toLowerCase();
    const type = document.getElementById(`search-select`).value.toLowerCase();
    setState(`searchTerm`, term );
    setState(`searchBy`, type );

    console.log(`type`, type);
    let drinks = {};

    if (`name` === type ) {
        drinks = await fetchDrinksByName();
    } else {
        drinks = await fetchDrinksByIngredient();
    }
    
    setState(`drinks`, drinks);
    console.log(state.drinks);

    if (state.drinks === null) {
        alert(`There are no results for "${state.searchTerm}"`);
        setState(`searchTerm`, null);
        document.getElementById(`search-field`).value = state.searchTerm;
    } else {
        const markup = lightbox();
        document.getElementById(`app`).insertAdjacentHTML(`beforeend`, markup);
        initLightbox();
    }
}
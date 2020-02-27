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
            <input id="search-field" name="search-term" type="search" placeholder="Search here..." />
            <select id="search-select" name="search-type">
                <option value="name">By Cocktail Name</option>
                <option value="ingredient">By Ingredient</option>
            </select>
            <input class="button-primary" type="submit" id="submit" value="Search Cocktails" />
        </form>
    `;
}

async function doSearch(e) {
    e.preventDefault();
    clearLightbox();
    clearNoResults();

    const term = document.getElementById(`search-field`).value.toLowerCase();
    const type = document.getElementById(`search-select`).value.toLowerCase();
    setState(`searchTerm`, term );
    setState(`searchBy`, type );

    let drinks = {};

    if (`name` === type ) {
        drinks = await fetchDrinksByName();
    } else {
        drinks = await fetchDrinksByIngredient();
    }
    
    setState(`drinks`, drinks);

    if (state.drinks === null || state.drinks === undefined) {
        const markup = `<h4 class="no-results">There are no results for <strong>${state.searchTerm}</strong> when searching for cocktails by ${state.searchBy}.</h4>`;
        document.getElementById(`app`).insertAdjacentHTML(`beforeend`, markup);
        setState(`searchTerm`, null);
        document.getElementById(`search-field`).value = state.searchTerm;
    } else {
        const markup = lightbox();
        document.getElementById(`app`).insertAdjacentHTML(`beforeend`, markup);
        initLightbox();
    }
}

function clearNoResults() {
    const noResults = document.querySelector(`.no-results`);
    if (noResults) noResults.remove();
}
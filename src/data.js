import { state } from "./state";

export function fetchDrinksByName() {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${state.searchTerm}`;
    return fetch(url)
        .then(res => res.json())
        .then(data => data.drinks)
        .catch(error => console.error(error));
}

export function fetchDrinksByIngredient() {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${state.searchTerm}`;
    return fetch(url)
        .then(res => res.json())
        .then(data => data.drinks)
        .catch(error => console.error(error));
}
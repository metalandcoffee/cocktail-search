import { state, setState } from "../../state";
import { open as openModal } from "../modal";
import "./index.css";

export default function lightbox() {
    let markup = `<div class="lightbox">`;
    state.drinks.forEach(drink => {
        const url = drink.strDrinkThumb;
        const title = drink.strDrink;
        markup += `<div class="thumbnail">
            <div class="img-container">
                <img src="${url}" alt="${title}" />
            </div>
            <h6>${title}</h6>
        </div>`;
    });
    markup += `</div>`;
    return markup;
}

export function init() {
    const drinks = Array.from(document.querySelectorAll(`.lightbox img`));
    drinks.forEach(drink => {
        drink.addEventListener(`click`, openLightbox);
    });
}

function openLightbox(e) {
    e.preventDefault();
    const currentDrinkIndex = getCurrentDrinkIndex(event.target);
    setState(`currentDrink`, currentDrinkIndex);
    console.log(state.currentDrink);
    openModal();
}

function getCurrentDrinkIndex(drink) {
    const drinks = Array.from(document.querySelectorAll(`.lightbox img`));

    let currentDrinkIndex = drinks
        .map(img => img.outerHTML)
        .findIndex(img => img == drink.outerHTML);

    return currentDrinkIndex;
}

export function clearLightbox() {
    const lightbox = document.querySelector(`.lightbox`);
    if (lightbox) lightbox.remove();
}
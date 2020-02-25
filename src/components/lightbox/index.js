import { state, setState } from "../../state";
import "./index.css";

export default function lightbox() {
    let markup = `<div class="lightbox">`;
    state.drinks.forEach(drink => {
        const url = drink.strDrinkThumb;
        const title = drink.strDrink;
        markup += `<div class="thumbnail">
            <img src="${url}" alt="${title}" />
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
    const currentImageIndex = getCurrentImageIndex(event.target);
    setState(`currentImage`, currentImageIndex);
    console.log(state.currentImage);
}

function getCurrentImageIndex(drink) {
    const drinks = Array.from(document.querySelectorAll(`.lightbox img`));

    let currentImageIndex = drinks
        .map(img => img.outerHTML)
        .findIndex(img => img == drink.outerHTML);

    return currentImageIndex;
}

export function clearLightbox() {
    const lightbox = document.querySelector(`.lightbox`);
    if (lightbox) lightbox.remove();
}
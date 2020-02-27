import { state, setState } from "../../state";

import "./index.css";

export function modal() {
    let markup = `
    <div id="overlay">
        <div id="modal">
            <article>
                <h3></h3>
                <img src="" alt="" />
                <h5>Ingredients</h5>
                <ul class="ingredients"></ul>
                <h5>Instructions</h5>
                <p class="instructions"></p>
            </article>
            <button id="close" href="#">X</button>
        </div>
    </div>
    `;

    return markup;
}

function updateModalContent() {
    const drink = state.drinks[state.currentDrink];
    console.log(drink);

    const title = drink.strDrink;
    const url = drink.strDrinkThumb;
    const ingredients = [];
    let ingredientsMarkup = ``;
    const instructions = drink.strInstructions;

    // There are 15 objects to store ingredients in the json. Loop through.
    for (let i = 1; i <= 15; i++ ) {
        const prop = `strIngredient` + i;
        if ( null === drink[prop] ) {
            break;
        }
        ingredients.push(drink[prop]);
    }
    
    for (const ingredient of ingredients) {
        console.log(`${ingredient}`);
        ingredientsMarkup += `<li>${ingredient}</li>`;
    }
    //console.log(ingredients);
    const titleEl = document.querySelector(`#modal h3`);
    const imageEl = document.querySelector(`#modal img`);
    const ingredientsEl = document.querySelector(`#modal .ingredients`);
    const instructionsEl = document.querySelector(`#modal .instructions`);
  
    titleEl.innerHTML = title;
    imageEl.src = url;
    imageEl.alt = title;
    ingredientsEl.innerHTML = ingredientsMarkup;
    instructionsEl.innerHTML = instructions;
}

export function open() {
    const container = document.querySelector(`#app`);
    container.insertAdjacentHTML("beforeend", modal());

    updateModalContent();
    init();
}

function close() {
    const overlay = document.querySelector(`#overlay`);
    overlay.remove();
}

function init() {
    const closeBtn = document.querySelector(`#modal #close`);
    closeBtn.addEventListener(`click`, close);
  
    const overlay = document.querySelector(`#overlay`);
    overlay.addEventListener(`click`, handleCloseClick);

    document.addEventListener("keyup", handleKeys);
}

function handleCloseClick(event) {
    if (event.target.id == "overlay") {
        close();
    }
}

function handleKeys(event) {
    if (event.key === "Escape") close();
}
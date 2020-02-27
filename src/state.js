const state = {
    searchTerm: null,
    searchBy: null,
    drinks: null,
    currentDrink: null,
};

const setState = (toSet, newValue) => {
    state[toSet] = newValue;
};

export { state, setState };
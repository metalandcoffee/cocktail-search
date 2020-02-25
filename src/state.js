const state = {
    searchTerm: null,
    searchBy: null,
    drinks: null,
};

const setState = (toSet, newValue) => {
    state[toSet] = newValue;
};

export { state, setState };
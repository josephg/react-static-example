const initialState = {
  // x: 5
};

module.exports = (state = initialState, action) => {
  switch(action.type) {
    case 'SETX':
      return {...state, x:action.x};
    default: return state;
  }
};

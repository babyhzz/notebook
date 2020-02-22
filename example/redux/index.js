let { createStore, applyMiddleware } = require('redux');

function reducer(state = {a: 1}, action) {
  return state;
}

let f = store => next => action => {
  console.log('middle f')
  return next(action)
}
let g = store => next => action => {
  console.log('middle g')
  return next(action)
}

const { getState, dispatch } = createStore(reducer, {a: 2}, applyMiddleware(f, g));
console.log(getState());

dispatch({type: 'ssss'});

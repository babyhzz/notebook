// let createSagaMiddleware = require('redux-saga').default;
// let { createStore, applyMiddleware } = require('redux');

// console.log(createSagaMiddleware);
// function *helloSaga() {
//   console.log('hello saga!');
// }

// const sagaMiddleware = createSagaMiddleware();

// const reducer = (state = {a: 1}, action) => {
//   return state;
// } 

// const store = createStore(reducer, applyMiddleware(sagaMiddleware));

// sagaMiddleware.run(helloSaga);

function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

console.log(g.next()) 
console.log(g.next()) 
console.log(g.next(true)) 
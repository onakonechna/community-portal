import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import StateLoader from './../utils/StateLoader';

const stateLoader = new StateLoader()
const state = stateLoader.loadState();

const store = createStore(
  rootReducer,
  state,
  composeWithDevTools(
    applyMiddleware(thunk)
  ),
);

store.subscribe(() => {
  stateLoader.saveState(store.getState());
});

export default store;

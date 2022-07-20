import { createStore, applyMiddleware } from "redux";
import { rootReducer } from "./reducers/index.js";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);
//const store = createStore(rootReducer,applyMiddleware(thunkMiddleware));

export default store;
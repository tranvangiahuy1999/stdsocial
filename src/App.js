import './stylesheet/App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import MainRoute from './route/index'
import reducers from './reducers/index'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)
let store = createStore(persistedReducer)
let persistor = persistStore(store)

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainRoute></MainRoute>
      </PersistGate>
    </Provider>
  );
}

export default App;

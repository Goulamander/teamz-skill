import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './containers/app'
import TagManager from 'react-gtm-module'

// import 'sanitize.css/sanitize.css'
import './assets/css/style.css'
import './assets/css/style-responsive.css'
import './assets/css/weekPicker.css'
import './index.css'
// import './assets/js/teamzskill-theme'

const target = document.querySelector('#root')

const tagManagerArgs = {
  gtmId: 'GTM-TVSD3TP',
  dataLayerName: 'PageDataLayer'
}

TagManager.initialize(tagManagerArgs);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
)

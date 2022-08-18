import React from 'react'
import ReactDOM from 'react-dom/client'

import { Application } from './app/application'

const root = document.querySelector('#root')

if (root) {
  ReactDOM.createRoot(root).render(<Application />)
}

/* Minimal SPA entry */
import { mountApp } from './app/router.js'
import './styles/base.css'

mountApp(document.getElementById('app'))

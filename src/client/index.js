// js files
import { formHandler } from './js/App';

//images
import './images/remove_circle_32_white.png'

// css files
import './styles/resets.scss';
import './styles/core.scss';
import './styles/index.scss';
import './styles/add-trip-form.scss';
import './styles/trip-card.scss';

document.getElementById('add-trip-form').addEventListener('submit', formHandler);

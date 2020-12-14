import { load, save, remove } from './storage';
import { pushError, removeError } from './pnotify';
import fetchFunctions from './fetchMe';
import myModal from './modalClass';
import fetchLogin from './authorization.js';

myModal.startListener();
decideTologin();

export default function decideTologin() {
  if (load('Token'))
    return document.body
      .querySelector('main div.container')
      .classList.add('authorized');
  document.body
    .querySelector('main div.container')
    .classList.remove('authorized');
}
console.log(load('Token').user);

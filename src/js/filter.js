import hbsFunction from '../templates/filter.hbs';
import renderCards from '../templates/cardset.hbs';
import renderCategories from '../templates/category.hbs';
import renderPagination from '../templates/pagination.hbs';
import fetchFunctions from './fetchMe.js';
import renderOffice from './myOffice';
import decideTologin from './main';
import {updateState} from './history/mainHistory';

import { save } from './storage';
import slider from './slider';


export default async function renderFilter() {
  const filterUL = document.querySelector('.header_filter');
  const filterRequest = {
    point: fetchFunctions.points.cat,
  };
  const response = await fetchFunctions.getRequest(filterRequest);
  save('cats', response);
  filterUL.innerHTML = hbsFunction(response);
  document.body.addEventListener('click', Mycallback);
  appPage();
}
renderFilter();


async function appPage(sales) {
  const searchQuery = {
    point: fetchFunctions.points.call,
    query: '?page=1',
  };
  const searchResult = await fetchFunctions.getRequest(searchQuery);
  if (sales) return searchResult.sales;
  const markup = await decideTologin(searchResult);
  const orderedSearch = renderPagination(markup);
  document.querySelector('main div.container').innerHTML = orderedSearch;
}

async function onPaginationPage(event) {
  const pagination = document.querySelector('div[data-pagination]');
  event.preventDefault();
  const currentActivePage = pagination.querySelector('.active');
  console.log(currentActivePage.textContent);
  currentActivePage.classList.remove('active');
  const currentPage = event.target;
  currentPage.classList.add('active');
  const numderPage = event.target.textContent;
  const searchQuery = {
    point: fetchFunctions.points.call,
    query: `?page=${numderPage}`,
  };
  const searchResult = await fetchFunctions.getRequest(searchQuery);
  const markup = await decideTologin(searchResult);
  const orderedSearch = renderCategories(markup);
  document.querySelector('section.categories').innerHTML = orderedSearch;
  updateState(`${searchQuery.query}`)
  window.scrollTo({
    top: 0,
  });
}






async function Mycallback(event) {
  if (event.target.hasAttribute('data-filter')) {
    event.preventDefault();
    const request = {
      point: fetchFunctions.points.catCalls,
      query: event.target.dataset.filter,
    };
    let response = null;
    if (event.target.dataset.filter === 'sales') {
      response = await appPage(true);
    } else {
      response = await fetchFunctions.getRequest(request);
      let value = event.target.getAttribute('data-category');
      updateState(`/category?value=${value}`);
    }  
    const markup = await decideTologin(response);
    document.querySelector('main div.container').innerHTML = renderCards(
      markup,
    );
    window.scrollTo({
      top: 0,
    });
  }



  if (event.target.classList.contains('pagination__link')) {
    const controlActiveFilter = document.body.querySelector(
      '.pagination__link.active',
    );
    if (controlActiveFilter) {
      controlActiveFilter.classList.remove('active');
    }
    const currentFilter = event.target;
    currentFilter.classList.add('active');
    onPaginationPage(event);
  }
  if (event.target.hasAttribute('data-clear-filter')) {
    appPage();
  }
  if (event.target.hasAttribute('data-office')) {
    renderOffice();
  }
  if (event.target.hasAttribute('data-out')) {
    const response = await fetchFunctions.logout();
    if (response) appPage();
  }
  if (event.target.closest('.cardset')) event.preventDefault();
  if (event.target.hasAttribute('data-slide')) slider(event);
}

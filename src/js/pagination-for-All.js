
import renderPaginationAll from '../templates/pegination-for-All.hbs';
import renderCards from '../templates/cardset.hbs';
const onPage = 16;
let dataM;

export default async function paginationAll(data) {
    dataM = data;    
    let pages = Math.ceil(data.length / onPage);
    let markup = [];
    for (let i = 0; i < onPage & i < data.length ; i += 1) {
        markup.push(data[i]);
    }
    document.querySelector('main div.container').innerHTML = await renderPaginationAll(markup);
    console.log(markup.length);
    for (let i = 0; i < pages; i += 1) {
        document.querySelector('main div.container .pagination-all').innerHTML += `<button class="btn-pag" data-from=${i} data-to=${i * pages + pages}>${i + 1}</button>`;
    }
    const pagination = document.querySelector('.pagination-all');
    
    // pagination.querySelector('.active').classList.remove('active');
    //  event.target.classList.add('active');
    pagination.firstElementChild.classList.add('active');
    document.body.addEventListener('click', onPaginationAllPage)
};
   
async function onPaginationAllPage(event) {
    if (event.target.classList.contains('btn-pag')) {           
        const currentActivePage = document.body.querySelector('.btn-pag.active');
        if (currentActivePage) {
         currentActivePage.classList.remove('active');
        }

        const currentPage = event.target;        
        currentPage.classList.add('active');
        console.log(currentPage);

        const from = currentPage.dataset.from * onPage;      
        const to = (currentPage.dataset.to  - 1)  * onPage;
        const sliced = dataM.slice(from, to );
       
        document.querySelector('section.categories').innerHTML = await renderCards(sliced);
       
        window.scrollTo({
        top: 0,
        });

       
    }    
};

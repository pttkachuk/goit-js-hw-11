import { fetchImages } from "./pixabayApi";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

//simplelightbox settings
let lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
});
//get elements from DOM
const elements = {
    searchForm: document.querySelector('.search-form'),
    loadMoreBtn: document.querySelector('.load-more'),
    galleryList: document.querySelector('.gallery'),
}

//let variables
let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

//add event listener and function on search form
elements.searchForm.addEventListener('submit', handlerOnSubmit);
async function handlerOnSubmit(event) {
    event.preventDefault();
    searchQuery = event.currentTarget.searchQuery.value;
    currentPage = 1;
    if (searchQuery === '') {
        return;
    }
    const responce = await fetchImages(searchQuery, currentPage);
    currentHits = responce.hits.length;
    if (responce.totalHits > 40) {
        elements.loadMoreBtn.classList.remove('is-hidden');
    } else {
        elements.loadMoreBtn.classList.add('is-hidden');
    }
    try {
        if (responce.totalHits > 0) {
            Notiflix.Notify.success(`Hooray! We found ${responce.totalHits} images.`);
            elements.galleryList.innerHTML = '';
            renderCardImage(responce.hits);
            lightbox.refresh();

            const { height: cardHeight } = document
                .querySelector(".gallery")
                .firstElementChild.getBoundingClientRect();

            window.scrollBy({
                top: cardHeight * -100,
                behavior: "smooth",
            });
        }
        if (responce.totalHits === 0) {
            elements.galleryList.innerHTML = ''
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            elements.loadMoreBtn.classList.add('is-hidden')
        }
    } catch (error) {
        console.log(error);
    }

}
//load more function
elements.loadMoreBtn.addEventListener('click', handlerOnBtnClick);
async function handlerOnBtnClick() {
    currentPage += 1;
    const responce = await fetchImages(searchQuery, currentPage);
    renderCardImage(responce.hits);
    lightbox.refresh();
    currentHits += responce.hits.length;
    if (currentHits === responce.totalHits) {
        elements.loadMoreBtn.classList.add('is-hidden')
    }
}

//function of rendering
function renderCardImage(array) {
    const markup =
        array.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
            return `<div class="photo-card">
        <a href="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
        }).join('');
    elements.galleryList.insertAdjacentHTML('beforeend', markup);
}
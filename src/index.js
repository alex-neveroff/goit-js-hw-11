import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchPhotos from './js/searchPhotos';
import renderPhoto from './js/renderPhoto';

const input = document.querySelector('.search__input');
const searchButton = document.querySelector('.search__button');
const searchForm = document.querySelector('.search__form');
const moreButton = document.querySelector('.more__button');
const gallery = document.querySelector('.gallery');
const request = new SearchPhotos();
let lightbox = new SimpleLightbox('.gallery .photo-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', getPhotos);
moreButton.addEventListener('click', loadMorePhotos);

function getPhotos(event) {
  event.preventDefault();
  request.formQuery = input.value;
  if (request.formQuery === '') {
    Notify.warning('Please, enter word or words for searching pictures.');
    return;
  }
  request.clearPage();
  clearGallery();
  getRequest();
}

function loadMorePhotos() {
  request.incrementPage();
  getRequest();
}

function getRequest() {
  request
    .answerOnQuery()
    .then(photoGallery => {
      const totalHits = photoGallery.totalHits;
      if (totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      } else if (request.page === 1) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      const photoHits = photoGallery.hits;
      photoHits.map(photoHit => {
        renderPhoto(photoHit);
      });
      showButton();
      lightbox.refresh();
    })
    .catch(error => {
      Notify.failure(`An error has occurred: ${error}`);
    });
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showButton() {
  moreButton.style.display = 'block';
}

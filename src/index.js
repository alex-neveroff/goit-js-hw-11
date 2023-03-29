import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchPhotos from './js/searchPhotos';
import renderPhoto from './js/renderPhoto';

const searchForm = document.querySelector('.search__form');
const loadMoreButton = document.querySelector('.more__button');
const gallery = document.querySelector('.gallery');
const switchLoadButton = document.querySelector('#load-more-button');

const searchPhotos = new SearchPhotos();
let lightbox = new SimpleLightbox('.gallery .photo-link', {
  captionsData: 'alt',
  captionDelay: 250,
});
let isLoading = false;

searchForm.addEventListener('submit', choseRadioButton);
searchForm.addEventListener('submit', getPhotos);

function choseRadioButton() {
  if (switchLoadButton.checked) {
    window.removeEventListener('scroll', infiniteScroll);
    loadMoreButton.addEventListener('click', loadMorePhotos);
  } else {
    hideButton();
    loadMoreButton.removeEventListener('click', loadMorePhotos);
    window.addEventListener('scroll', infiniteScroll);
  }
}

function getRequest() {
  if (isLoading) return;
  isLoading = true;

  searchPhotos
    .getGallery()
    .then(photoGallery => {
      const totalHits = photoGallery.totalHits;
      if (totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      } else if (searchPhotos.page === 2) {
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      const photoHits = photoGallery.hits;
      photoHits.map(photoHit => {
        renderPhoto(photoHit);
      });

      lightbox.refresh();

      if (totalHits / searchPhotos.per_page <= searchPhotos.page) {
        Notify.warning(
          `We're sorry, but you've reached the end of search results.`
        );
        window.removeEventListener('scroll', infiniteScroll);
      }
      tongleLoadMoreButton(totalHits);
      isLoading = false;
    })
    .catch(error => {
      Notify.failure(`An error has occurred: ${error}`);
      isLoading = false;
    });
}

function getPhotos(event) {
  event.preventDefault();

  searchPhotos.query = event.currentTarget.elements.searchQuery.value;
  if (searchPhotos.query === '') {
    Notify.warning('Please, enter word or words for searching pictures.');
    return;
  }
  searchPhotos.resetPage();
  clearGallery();
  getRequest();
}

function loadMorePhotos() {
  getRequest();
}

function tongleLoadMoreButton(totalHits) {
  if (switchLoadButton.checked) {
    if (totalHits / searchPhotos.per_page <= searchPhotos.page) {
      hideButton();
    } else {
      showButton();
    }
    if (searchPhotos.page > 1) {
      smoothScroll();
    }
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showButton() {
  loadMoreButton.classList.remove('hidden');
}

function hideButton() {
  loadMoreButton.classList.add('hidden');
}

function smoothScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function infiniteScroll() {
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = window.innerHeight;
  const scrollHeight = document.body.offsetHeight;

  if (scrollTop + clientHeight >= scrollHeight && !isLoading) {
    getRequest();
  }
}

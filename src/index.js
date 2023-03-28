import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchPhotos from './js/searchPhotos';
import renderPhoto from './js/renderPhoto';

const input = document.querySelector('.search__input');
const searchForm = document.querySelector('.search__form');
const moreButton = document.querySelector('.more__button');
const gallery = document.querySelector('.gallery');
const loadWithScrolling = document.querySelector('#infinite-scroll');
const loadWithButton = document.querySelector('#load-more-button');
const request = new SearchPhotos();
let lightbox = new SimpleLightbox('.gallery .photo-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

searchForm.addEventListener('submit', choseRadioButton);
searchForm.addEventListener('submit', getPhotos);

function choseRadioButton() {
  if (loadWithButton.checked) {
    window.removeEventListener('scroll', infiniteScroll);
    moreButton.addEventListener('click', loadMorePhotos);
  } else if (loadWithScrolling.checked) {
    hideButton();
    moreButton.removeEventListener('click', loadMorePhotos);
    window.addEventListener('scroll', infiniteScroll);
  }
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

      lightbox.refresh();

      if (photoHits.length < request.per_page) {
        Notify.warning(
          `We're sorry, but you've reached the end of search results.`
        );
      }
      tongleLoadMoreButton(photoHits);
    })
    .catch(error => {
      Notify.failure(`An error has occurred: ${error}`);
    });
}

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

function tongleLoadMoreButton(hits) {
  if (loadWithButton.checked) {
    if (hits.length < request.per_page) {
      hideButton();
    } else {
      showButton();
    }
    if (request.page > 1) {
      smoothScroll();
    }
  }
}

function clearGallery() {
  gallery.innerHTML = '';
}

function showButton() {
  moreButton.classList.remove('hidden');
}

function hideButton() {
  moreButton.classList.add('hidden');
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
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 30) {
    request.incrementPage();
    getRequest();
  }
}

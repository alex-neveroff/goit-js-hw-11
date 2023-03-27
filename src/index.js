import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayRequest from './js/api';

const input = document.querySelector('.search__input');
const searchButton = document.querySelector('.search__button');
const searchForm = document.querySelector('.search__form');
const moreButton = document.querySelector('.more__button');
const request = new PixabayRequest();

searchForm.addEventListener('submit', getPhotos);
moreButton.addEventListener('click', loadMorePhotos);

function getPhotos(event) {
  event.preventDefault();
  request.formQuery = input.value;
  if (request.formQuery === '') {
    Notify.warning('Please, enter word or words for searching pictures.');
    return;
  }

  request
    .answerOnQuery()
    .then(photoGallery => {
      const totalHits = photoGallery.totalHits;
      if (totalHits === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notify.success(`Hooray! We found ${totalHits} images.`);
      // вывести галлерею через html
      moreButton.style.display = 'block';
    })
    .catch(error => {
      Notify.failure(`An error has occurred: ${error}`);
    });
}

function loadMorePhotos() {}

// let lightbox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });

// ************
// SimpleLightbox;
{
  /* <a href="images/image1.jpg">
  <img src="images/thumbs/thumb1.jpg" alt="" title="" />
</a>; */
}

// ************

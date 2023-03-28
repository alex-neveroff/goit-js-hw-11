const gallery = document.querySelector('.gallery');

export default function renderPhoto(photoHit) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = photoHit;

  const photoCard = `  
  <div class="photo-card">
    <a class="photo-link" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" width="300"  loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes ${likes} times</b>
        </p>
        <p class="info-item">
          <b>Views ${views} times</b>
        </p>
        <p class="info-item">
          <b>Comments ${comments} times</b>
        </p>
        <p class="info-item">
          <b>Downloads ${downloads} times</b>
        </p>
      </div>
    
  </div>`;

  gallery.insertAdjacentHTML('beforeend', photoCard);
}

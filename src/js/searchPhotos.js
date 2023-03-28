import axios from 'axios';

export default class SearchPhotos {
  constructor() {
    this.personalKey = '34787043-b3a92aa7f6b31659862f07be8';
    this.formQuery = '';
    this.image_type = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = 'true';
    this.page = '1';
    this.per_page = '40';
  }

  async answerOnQuery() {
    const BASE_URL = 'https://pixabay.com/api/?';
    const url = `${BASE_URL}key=${this.personalKey}&q=${this.formQuery}&image_type=${this.image_type}&orientation=${this.orientation}&safesearch=${this.safesearch}&page=${this.page}&per_page=${this.per_page}`;

    return await axios.get(url).then(res => res.data);
  }

  incrementPage() {
    this.page += 1;
  }

  clearPage() {
    this.page = 1;
  }
}

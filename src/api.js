const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34608361-47fad47221650f74f55826075';

export default class ImagesApiService {
  constructor() {
    this.query = '';
    this.page = 1;
  }

  async getImages() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    this.updatePage();

    const response = await fetch(url);
    return await response.json();
  }

  updatePage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

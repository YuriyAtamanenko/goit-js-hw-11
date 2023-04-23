import './css/styles.css';

import ImagesApiService from './api.js';
import LoadMoreBtn from './components/LoadMoreBtn';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.search-form'),
  container: document.querySelector('.gallery'),
};

const lightbox = new SimpleLightbox('.gallery a', { overlayOpacity: 0.9 });

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

refs.form.addEventListener('submit', onSubmitBtn);
loadMoreBtn.button.addEventListener('click', onLoadMoreBtn);

function onSubmitBtn(event) {
  event.preventDefault();

  refs.container.innerHTML = '';
  imagesApiService.resetPage();

  imagesApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();

  imagesApiService
    .getImages()
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        refs.container.innerHTML = '';
      } else {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        createMarkup(data.hits);
        loadMoreBtn.show();
      }
    })
    .catch(error => console.log(error))
    .finally(refs.form.reset());
}

function onLoadMoreBtn() {
  loadMoreBtn.disable();
  imagesApiService
    .getImages()
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );

        loadMoreBtn.hide();
        loadMoreBtn.enable();
      } else {
        createMarkup(data.hits);
        loadMoreBtn.enable();
      }
    })
    .catch(error => console.log(error));
}

function createMarkup(imgs) {
  const createMarkup = imgs
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href=${largeImageURL}><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width='345px' height='230px' />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div></a>`;
      }
    )
    .join('');

  updateWorkPage(createMarkup);
}

function updateWorkPage(markup) {
  refs.container.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

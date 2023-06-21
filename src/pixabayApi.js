import axios from 'axios';

async function fetchImages(value, page) {
    const BASE_URl = 'https://pixabay.com/api/';
    const API_KEY = '37626526-981480af389493ca84731da49';
    const filter = `?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;
    return await axios.get(`${BASE_URl}${filter}`).then(responce => responce.data);
}

export { fetchImages };
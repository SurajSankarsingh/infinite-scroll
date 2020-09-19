const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let isInitialLoad = true;
let photosArray = []; 

// Unsplash API
let initialCount = 10;
const apiKey = 'r0ZFNhC8k3bbZfZPjOXtr2mENr5k9D9TFc218VYN_NQ';
let apiUrl =`https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}`
}

// check if all images has loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// helper func to set attributes to DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create elements for Links & Photos, add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // run func for each obj in photosArray
  photosArray.forEach((photo) => {
// create <a> to link to Unsplash
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });
    // create <img> for photo
    const img = document.createElement('img');
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
// Event Listener, check when each is finished loading
  img.addEventListener('load', imageLoaded);
// Put <img> inside <a>, then put both inside imageContainer ELement
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json()
    displayPhotos();
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30)
      isInitialLoad = false;
    }
  } catch (error) {
    // Catch error here
  }
}

// check to see if scrolling is near bottom of page, load more photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos()
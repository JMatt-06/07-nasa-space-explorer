// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const mediaFilter = document.getElementById('mediaFilter');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Array of fun space facts
const spaceFacts = [
  "One day on Venus is longer than its year! Venus takes 243 Earth days to rotate once, but only 225 Earth days to orbit the Sun.",
  "Jupiter's Great Red Spot is a storm that has been raging for over 400 years and is larger than Earth.",
  "Neutron stars are so dense that a teaspoon of neutron star material would weigh about 6 billion tons.",
  "The Milky Way galaxy is on a collision course with the Andromeda galaxy, but they won't collide for another 4.5 billion years.",
  "Saturn's moon Titan has lakes and rivers made of liquid methane and ethane instead of water.",
  "The footprints left by astronauts on the Moon will last for millions of years because there's no wind or water to erode them.",
  "A year on Mercury lasts only 88 Earth days, making it the fastest planet to orbit the Sun.",
  "The Sun is so massive that it accounts for 99.86% of all the mass in our solar system.",
  "Astronauts can grow up to 2 inches taller in space due to the lack of gravity compressing their spine.",
  "The International Space Station travels at about 17,500 mph and orbits Earth every 90 minutes.",
  "There are more possible games of chess than there are atoms in the observable universe.",
  "If you could fly a plane to Pluto, it would take more than 800 years to get there.",
  "The largest volcano in our solar system is Olympus Mons on Mars, which is about 13.6 miles high.",
  "Space is completely silent because sound waves need a medium like air or water to travel through.",
  "One million Earths could fit inside the Sun, and the Sun is considered a medium-sized star.",
  "The Hubble Space Telescope has traveled more than 4 billion miles since its launch in 1990.",
  "Europa, one of Jupiter's moons, may have twice as much water as all of Earth's oceans combined.",
  "A day on the Moon lasts about 29.5 Earth days, with roughly two weeks of daylight followed by two weeks of darkness.",
  "The coldest place in the universe that we know of is the Boomerang Nebula, at -458°F (-272°C).",
  "Halley's Comet returns to Earth's vicinity every 75-76 years and won't be back until 2061."
];

// Function to display a random space fact
function displayRandomSpaceFact() {
  const factElement = document.getElementById('factText');
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  const randomFact = spaceFacts[randomIndex];
  
  // Add a fade effect when changing the fact
  factElement.style.opacity = '0.5';
  
  setTimeout(() => {
    factElement.textContent = randomFact;
    factElement.style.opacity = '1';
  }, 200);
}

// Display a random fact when the page loads
document.addEventListener('DOMContentLoaded', displayRandomSpaceFact);

// Add event listener for the fact refresh button
document.addEventListener('DOMContentLoaded', () => {
  const refreshFactButton = document.getElementById('refreshFact');
  refreshFactButton.addEventListener('click', displayRandomSpaceFact);
});

// NASA APOD API endpoint
// Note: Replace 'YOUR_API_KEY_HERE' with your actual NASA API key
const NASA_API_KEY = 'lv9rt1Arvtq3zQvmbwRy26JZShoA9qgn2qntZtHW'; // Get your free key at https://api.nasa.gov
const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';

// Find the button and gallery elements
const getImagesButton = document.querySelector('button');
const gallery = document.getElementById('gallery');

// Find modal elements
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const closeButton = document.querySelector('.close');

// Add click event listener to the button
getImagesButton.addEventListener('click', getSpaceImages);

// Add event listeners for modal
closeButton.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  // Close modal if user clicks outside the content
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.style.display === 'block') {
    closeModal();
  }
});

// Function to fetch images from NASA's APOD API
async function getSpaceImages() {
  // Get the selected date range from the inputs
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  // Check if both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates');
    return;
  }
  
  // Show loading message
  gallery.innerHTML = '<div class="loading">🚀 Loading space images...</div>';
  
  try {
    // Build the API URL with the date range
    const apiUrl = `${NASA_API_URL}?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;
    
    // Fetch data from NASA's API
    const response = await fetch(apiUrl);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    // Convert the response to JSON
    const spaceData = await response.json();
    
    // Display the images in the gallery
    displayImages(spaceData);
    
    // Display a new random space fact when new images are loaded
    displayRandomSpaceFact();
    
  } catch (error) {
    // Handle any errors that occur during the API call
    console.error('Error fetching space images:', error);
    gallery.innerHTML = `
      <div class="error">
        <p>Sorry, we couldn't load the space images.</p>
        <p>Please try again later.</p>
      </div>
    `;
  }
}

// Function to display the fetched images in the gallery
function displayImages(images) {
  // Clear the gallery
  gallery.innerHTML = '';
  
  // Get the selected media filter
  const filterValue = mediaFilter.value;
  
  // Filter images based on media type selection
  let filteredImages = images;
  if (filterValue !== 'all') {
    filteredImages = images.filter(image => image.media_type === filterValue);
  }
  
  // Show filter results info
  if (filteredImages.length !== images.length && images.length > 0) {
    const filterInfo = document.createElement('div');
    filterInfo.className = 'filter-info';
    filterInfo.innerHTML = `
      <p>Showing ${filteredImages.length} of ${images.length} entries 
      ${filterValue === 'image' ? '(Images only)' : filterValue === 'video' ? '(Videos only)' : ''}</p>
    `;
    gallery.appendChild(filterInfo);
  }
  
  // Loop through each filtered image and create HTML elements
  filteredImages.forEach(image => {
    // Create a container for each image
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    
    // Build the HTML content for each image/video
    // Note: Some APOD entries are videos, so we check the media_type
    let mediaContent = '';
    if (image.media_type === 'image') {
      mediaContent = `
        <div class="image-container">
          <img src="${image.url}" alt="${image.title}" />
        </div>
      `;
      // Make image cards clickable for images only
      imageCard.style.cursor = 'pointer';
      imageCard.addEventListener('click', () => openModal(image));
    } else if (image.media_type === 'video') {
      // For videos, create an enhanced video preview with thumbnail
      mediaContent = createVideoContent(image);
      // Don't make video cards open in modal, they have their own interaction
    } else {
      // Fallback for any other media types
      mediaContent = `
        <div class="video-placeholder">
          <p>📄 Other content</p>
          <a href="${image.url}" target="_blank" rel="noopener noreferrer">View Content</a>
        </div>
      `;
    }
    
    // Create the complete card HTML
    imageCard.innerHTML = `
      ${mediaContent}
      <div class="card-content">
        <h3>${image.title}</h3>
        <p class="date">${image.date}</p>
        <p class="explanation">${image.explanation}</p>
        ${image.media_type === 'video' ? '<p class="media-type">🎥 Video Content</p>' : ''}
      </div>
    `;
    
    // Add the card to the gallery
    gallery.appendChild(imageCard);
  });
  
  // If no images were returned after filtering, show a message
  if (filteredImages.length === 0) {
    const messageText = images.length === 0 
      ? 'No content found for the selected date range.' 
      : `No ${filterValue}s found for the selected date range. Try selecting "All Content" or different dates.`;
    
    gallery.innerHTML = `
      <div class="no-results">
        <p>${messageText}</p>
        <p>Try selecting different dates or content type.</p>
      </div>
    `;
  }
}

// Function to create enhanced video content
function createVideoContent(videoData) {
  // Check if it's a YouTube video and extract video ID for thumbnail
  const youtubeMatch = videoData.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    return `
      <div class="video-container">
        <div class="video-thumbnail" style="background-image: url('${thumbnailUrl}');">
          <div class="play-button">
            <svg width="68" height="48" viewBox="0 0 68 48">
              <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
              <path d="M 45,24 27,14 27,34" fill="#fff"></path>
            </svg>
          </div>
          <div class="video-duration">🎥 Video</div>
        </div>
        <div class="video-actions">
          <a href="${videoData.url}" target="_blank" rel="noopener noreferrer" class="video-link primary">
            Watch on YouTube
          </a>
          <button onclick="embedVideo('${videoId}', this)" class="video-link secondary">
            Play Here
          </button>
        </div>
      </div>
    `;
  } else {
    // For non-YouTube videos, show a generic video placeholder
    return `
      <div class="video-placeholder">
        <div class="video-icon">🎥</div>
        <p class="video-type">Video Content</p>
        <a href="${videoData.url}" target="_blank" rel="noopener noreferrer" class="video-link primary">
          Watch Video
        </a>
      </div>
    `;
  }
}

// Function to embed YouTube video directly in the card
function embedVideo(videoId, buttonElement) {
  // Find the video container
  const videoContainer = buttonElement.closest('.video-container');
  const thumbnail = videoContainer.querySelector('.video-thumbnail');
  
  // Replace thumbnail with embedded video
  thumbnail.innerHTML = `
    <iframe 
      width="100%" 
      height="200" 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
      frameborder="0" 
      allow="autoplay; encrypted-media" 
      allowfullscreen>
    </iframe>
  `;
  
  // Hide the video actions since video is now embedded
  const actions = videoContainer.querySelector('.video-actions');
  actions.style.display = 'none';
}

// Function to open the modal with image details
function openModal(imageData) {
  // Set the modal content
  modalImage.src = imageData.hdurl || imageData.url; // Use HD version if available
  modalImage.alt = imageData.title;
  modalTitle.textContent = imageData.title;
  modalDate.textContent = imageData.date;
  modalExplanation.textContent = imageData.explanation;
  
  // Show the modal
  modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
  // Hide the modal
  modal.style.display = 'none';
}

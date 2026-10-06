const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');
const statusText = document.getElementById('status');

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    fetchImages(query);
  }
});

async function fetchImages(query) {
  statusText.textContent = 'Loading...';
  resultsContainer.innerHTML = ''; // Clear previous results

  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&format=json&origin=*&prop=imageinfo&iiprop=url`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    statusText.textContent = '';

    if (data.query && data.query.pages) {
      Object.values(data.query.pages).forEach(page => {
        if (page.imageinfo && page.imageinfo[0]) {
          // Create the card container
          const card = document.createElement('div');
          card.className = 'gallery-item';

          // Set content inside the card
          card.innerHTML = `
            <img src="${page.imageinfo[0].url}" alt="${page.title}">
            <p>${page.title}</p>
          `;

          // Append card to the grid
          resultsContainer.appendChild(card);
        }
      });
    } else {
      statusText.textContent = 'No images found.';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    statusText.textContent = 'Error loading images. Please try again.';
  }
}
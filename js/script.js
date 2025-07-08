const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

setupDateInputs(startInput, endInput);
// Constants
const API_KEY = 'CvlSCoVc5k8seRB3NjzPu9RaDcrm4x9D1Vw8OTZR';
const gallery = document.getElementById('gallery');
const button = document.querySelector('button');

// Add random space facts
const facts = [
  "It would take nine years to walk to the moon!",
  "Mars is called the Red Planet because of its red coloring, which comes from the large amount of iron oxide – known on Earth as rust – on the planet’s surface",
  "Mercury’s temperature varies from -280° F on its night side to 800° F during the day!",
  "If you can spot the Andromeda Galaxy with your naked eyes, you can see something 14.7 billion billion miles away!",
  "The Sun is 400 times larger than the Moon, but also 400 times as far away, making both objects appear to be the same size in our sky.",
  "Jupiter is the largest planet. It could contain the other seven planets in just 70 percent of its volume.",
  "Stars don’t twinkle until their light passes through Earth’s atmosphere.",
  "If Earth were the size of a tennis ball, the Sun would be a sphere 24 feet across, approximately 0.5 mile away.",
  "Of the 9,113 official features on the Moon, a mere 421 (4.6 percent) are not craters.",
  "Driving a car to the nearest star at 70 mph would take more than 356 billion years!"
];

// Inject a random fact
const factDiv = document.createElement('div');
factDiv.className = 'space-fact';
factDiv.textContent = "🪐 Did You Know? " + facts[Math.floor(Math.random() * facts.length)];
document.querySelector('.container').insertBefore(factDiv, gallery);

// Add modal structure
const modal = document.createElement('div');
modal.id = 'modal';
modal.className = 'modal hidden';
modal.innerHTML = `
  <div class="modal-content">
    <span class="close">&times;</span>
    <div id="modal-body"></div>
  </div>
`;
document.body.appendChild(modal);

// Modal close logic
document.querySelector('.close').onclick = () => modal.classList.add('hidden');
window.onclick = e => { if (e.target == modal) modal.classList.add('hidden'); };

// Fetch button logic
button.addEventListener('click', async () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  gallery.innerHTML = `<p class="loading">🔄 Loading space photos…</p>`;

  try {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`);
    const data = await res.json();
    renderGallery(data);
  } catch (error) {
    gallery.innerHTML = `<p>Error fetching data. Try again later.</p>`;
    console.error("Fetch error:", error);
  }
});

function renderGallery(items) {
  gallery.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'gallery-item hover-zoom';

    if (item.media_type === "image") {
      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <p><strong>${item.title}</strong><br>${item.date}</p>
      `;
    } else if (item.media_type === "video") {
      card.innerHTML = `
        <div class="video-thumb">
          <a href="${item.url}" target="_blank">
            <img src="https://img.youtube.com/vi/${extractYouTubeID(item.url)}/hqdefault.jpg" alt="Video thumbnail" />
            <div class="play-overlay">▶️</div>
          </a>
        </div>
        <p><strong>${item.title}</strong><br>${item.date}</p>
      `;
    }

    card.addEventListener('click', () => openModal(item));
    gallery.appendChild(card);
  });
}

function openModal(item) {
  let content;
  if (item.media_type === "image") {
    content = `
      <img src="${item.url}" alt="${item.title}" />
      <h2>${item.title}</h2>
      <p><strong>${item.date}</strong></p>
      <p>${item.explanation}</p>
    `;
  } else if (item.media_type === "video") {
    content = `
      <iframe width="100%" height="400" src="${item.url}" frameborder="0" allowfullscreen></iframe>
      <h2>${item.title}</h2>
      <p><strong>${item.date}</strong></p>
      <p>${item.explanation}</p>
    `;
  }

  document.getElementById('modal-body').innerHTML = content;
  modal.classList.remove('hidden');
}

function extractYouTubeID(url) {
  const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : "default";
}

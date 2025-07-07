// NASA API Key
const API_KEY = "https://api.nasa.gov/planetary/apod?api_key=rAGUypynj5JX65mKqa4VOcwZcrq9dvv5saWpwZl9Y";
const API_URL = "https://api.nasa.gov/planetary/apod";

// DOM Elements
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const button = document.querySelector("button");
const gallery = document.getElementById("gallery");

// Add a random space fact on load
const spaceFacts = [
  "Venus rotates in the opposite direction to most planets.",
  "One day on Venus is longer than its year.",
  "Neutron stars can spin 600 times per second.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Jupiter’s Great Red Spot is shrinking.",
  "Saturn could float in water due to its low density.",
  "A spoonful of a neutron star would weigh about a billion tons.",
];
function showRandomFact() {
  const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  const factDiv = document.createElement("div");
  factDiv.style.textAlign = "center";
  factDiv.style.margin = "20px";
  factDiv.innerHTML = `<strong>🌌 Did You Know?</strong> ${fact}`;
  gallery.insertAdjacentElement("beforebegin", factDiv);
}
showRandomFact();

// Add hover zoom CSS effect
const style = document.createElement("style");
style.textContent = `
  .gallery-item img:hover {
    transform: scale(1.05);
    transition: transform 0.3s ease-in-out;
  }
`;
document.head.appendChild(style);

// Event listener for button
button.addEventListener("click", async () => {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate || !endDate) {
    alert("Please select both start and end dates.");
    return;
  }

  gallery.innerHTML = `<p style="text-align:center;">🔄 Loading space photos...</p>`;

  try {
    const response = await fetch(
      `${API_URL}?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
    );
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Unexpected API response");
    }

    displayGallery(data.reverse()); // reverse for most recent first
  } catch (error) {
    gallery.innerHTML = `<p style="color:red; text-align:center;">Error fetching data: ${error.message}</p>`;
  }
});

function displayGallery(items) {
  gallery.innerHTML = ""; // clear gallery

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "gallery-item";

    if (item.media_type === "image") {
      card.innerHTML = `
        <img src="${item.url}" alt="${item.title}" />
        <p><strong>${item.title}</strong><br>${item.date}</p>
      `;
      card.addEventListener("click", () => showModal(item));
    } else if (item.media_type === "video") {
      card.innerHTML = `
        <div style="height:200px; background:#000; display:flex; align-items:center; justify-content:center; color:#fff; text-align:center;">
          <p>🎥 Video Content<br><a href="${item.url}" target="_blank" style="color:lightblue;">Watch Video</a></p>
        </div>
        <p><strong>${item.title}</strong><br>${item.date}</p>
      `;
      card.addEventListener("click", () => showModal(item));
    }

    gallery.appendChild(card);
  });
}

function showModal(item) {
  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = 0;
  modal.style.left = 0;
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0, 0, 0, 0.8)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = 1000;

  const content = document.createElement("div");
  content.style.background = "#fff";
  content.style.borderRadius = "8px";
  content.style.maxWidth = "800px";
  content.style.maxHeight = "90vh";
  content.style.overflowY = "auto";
  content.style.padding = "20px";
  content.style.position = "relative";

  const closeBtn = document.createElement("span");
  closeBtn.textContent = "✖";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "15px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.fontSize = "18px";

  closeBtn.onclick = () => modal.remove();

  content.appendChild(closeBtn);

  if (item.media_type === "image") {
    content.innerHTML += `
      <img src="${item.hdurl || item.url}" alt="${item.title}" style="width:100%; max-height:500px; object-fit:contain; border-radius: 4px;" />
    `;
  } else {
    content.innerHTML += `
      <div style="width:100%; height:400px;">
        <iframe src="${item.url}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
  }

  content.innerHTML += `
    <h2>${item.title}</h2>
    <p><strong>${item.date}</strong></p>
    <p>${item.explanation}</p>
  `;

  modal.appendChild(content);
  document.body.appendChild(modal);
}

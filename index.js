Access-Control-Allow-Origin;
Access-Control-Allow-Methods: POST, GET, OPTIONS;
Access-Control-Allow-Headers;
const search = document.getElementById("search");
const form = document.getElementById("form");
const result = document.getElementById("result");

//api url

const apiURL = "https://api.lyrics.ovh";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const search_value = search.value.trim();

  //checking whether the serach value is valid or not

  if (!search_value) {
    alert(
      "There is nothing to search. Please enter a valid song title or artist name"
    );
  } else {
    searchsong(search_value);
  }
});

async function searchsong(searchvalue) {
  const searchresult = await fetch(`${apiURL}/suggest/${searchvalue}`);
  const data = await searchresult.json();

  //showing data
  showData(data);
}
// Display final result in DOM

function showData(data) {
  result.innerHTML = `<ul class="song-list">
    ${data.data
      .map(
        (song) => `
    <li>
    <div>
    <strong>${song.artist.name}</strong> - ${song.title}
    </div>
    <span data-artist="${song.artist.name}" data-songtitle="${song.title}"> get lyrics</span>
    </li>
    `
      )
      .join("")}
    </ul>`;
}

result.addEventListener("click", (e) => {
  const clickedelement = e.target;
  if (clickedelement.tagName == "SPAN") {
    const artist = clickedelement.getAttribute("data-artist");
    const songtitle = clickedelement.getAttribute("data-songtitle");
    getlyrics(artist, songtitle);
  }
});

async function getlyrics(artist, songname) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songname}`);
  const data = await res.json();
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  result.innerHTML = `<h2 class="songinfo"><strong>${artist}</strong> - ${songname}</h2>
  <p class="lyrics">${lyrics}</p>
  `;
}

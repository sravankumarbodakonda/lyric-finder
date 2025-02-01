
        const search = document.getElementById("search");
        const form = document.getElementById("form");
        const result = document.getElementById("result");

        // API URL
        const apiURL = "https://api.lyrics.ovh";

        // Event listener for form submission
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const searchValue = search.value.trim();

            // Validate search input
            if (!searchValue) {
                alert("Please enter a song title or artist name.");
            } else {
                searchSong(searchValue);
            }
        });

        // Fetch song suggestions from API
        async function searchSong(searchValue) {
            try {
                const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
                if (!searchResult.ok) throw new Error("Failed to fetch song suggestions.");
                const data = await searchResult.json();
                showData(data);
            } catch (error) {
                result.innerHTML = `<p class="error">${error.message}</p>`;
            }
        }

        // Display song suggestions in the DOM
        function showData(data) {
            if (!data.data || data.data.length === 0) {
                result.innerHTML = `<p class="error">No results found. Please try another search.</p>`;
                return;
            }

            result.innerHTML = `
                <ul class="song-list">
                    ${data.data.map(song => `
                        <li>
                            <div>
                                <strong>${song.artist.name}</strong> - ${song.title}
                            </div>
                            <span data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</span>
                        </li>
                    `).join("")}
                </ul>
            `;
        }

        // Event listener for "Get Lyrics" button
        result.addEventListener("click", (e) => {
            const clickedElement = e.target;
            if (clickedElement.tagName === "SPAN") {
                const artist = clickedElement.getAttribute("data-artist");
                const songTitle = clickedElement.getAttribute("data-songtitle");
                getLyrics(artist, songTitle);
            }
        });

        // Fetch lyrics from API
        async function getLyrics(artist, songTitle) {
            try {
              const res = await fetch(`${apiURL}/v1/${encodeURIComponent(artist)}/${encodeURIComponent(songTitle)}`);
                if (!res.ok) throw new Error("Failed to fetch lyrics.");
                const data = await res.json();
                if (!data.lyrics) throw new Error("Lyrics not found for this song.");
                const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
                result.innerHTML = `
                    <h2 class="songinfo"><strong>${artist}</strong> - ${songTitle}</h2>
                    <p class="lyrics">${lyrics}</p>
                `;
            } catch (error) {
                result.innerHTML = `<p class="error">${error.message}</p>`;
            }
        }
   
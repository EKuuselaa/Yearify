
    const clientId = '46df134103fc4119bf515625f8280155'; // annetaan spotify kredentiaalit
    const clientSecret = '2ee599abe5434cbcaaf2401ce5a9b622'; // annetaan spotify kredentiaalit

    
    const _getToken = async () => { // palauttaa api tokenin

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        
        return data.access_token;
    }

        // Function to update the Spotify iframe with a new track ID
    function updateSpotifyPlayer(trackId) {
        const spotifyPlayer = document.getElementById('spotifyPlayer');
        spotifyPlayer.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
    }

    
    async function searchTracks() { // Apilta data vuoden , genren, tai vuoden ja genren perusteella
        const year = document.getElementById('yearInput').value;
        const genre = document.getElementById('genreInput').value;
        let query = '';
    
        if (year && genre) {
            query = `year:${year} genre:"${genre}"`;
            console.log("Both");
        } else if (year) {
            query = `year:${year}`;
            console.log("year only");
        } else if (genre) {
            query = `genre:"${genre}"`;
            console.log("genre only");
        } else {
            console.error('Invalid search parameters');
            return;
        }
    
        const token = await _getToken();
    
        const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    
        const data = await response.json();
        console.log(data);
        const tracks = data.tracks.items;
        
        const tracksList = document.getElementById('tracksList');
        tracksList.innerHTML = '';
    
        tracks.forEach(track => {
            const trackElement = document.createElement('div');
    
            const imgElement = document.createElement('img');
            imgElement.src = track.album.images[0].url;
            imgElement.alt = 'Track Image';
            imgElement.style.width = '100px';
            trackElement.appendChild(imgElement);
    
            const nameElement = document.createElement('p');
            nameElement.textContent = track.name;
            trackElement.appendChild(nameElement);
    
            const artistElement = document.createElement('p');
            artistElement.textContent = track.artists.map(artist => artist.name).join(', ');
            trackElement.appendChild(artistElement);
    
            const addButton = document.createElement('button');
            addButton.textContent = 'Add to Playlist';
            addButton.addEventListener('click', () => {
                updateSpotifyPlayer(track.id); // Update the Spotify player with the track ID
            });
            trackElement.appendChild(addButton);
    
            tracksList.appendChild(trackElement);
        });
    }


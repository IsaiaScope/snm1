document.getElementById('createPlaylistForm').addEventListener('submit', async function(e) {
    e.preventDefault();
  
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const tags = document.getElementById('tags').value.split(',');
    const songs = document.getElementById('songs').value.split(',');
  
    const data = { title, description, tags, songs };
  
    try {
      const response = await fetch('http://127.0.0.1:3000/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const result = await response.json();
        alert('Playlist creata con successo');
        // Aggiungi codice per aggiornare il frontend
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Si è verificato un errore durante la creazione della playlist');
    }
  });
  
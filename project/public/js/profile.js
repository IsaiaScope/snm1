document.addEventListener('DOMContentLoaded', async function() {
  try {

    const response = await fetch('http://127.0.0.1:3000/api/users/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const result = await response.json();
    if (response.ok) {
      document.getElementById('nome').textContent = result.nome;
      document.getElementById('cognome').textContent = result.cognome;
      document.getElementById('username').textContent = result.username;
      document.getElementById('email').textContent = result.email;
      document.getElementById('eta').textContent = result.eta;
      document.getElementById('preferenzeMusicali').textContent = result.preferenzeMusicali.join(', ');
      document.getElementById('gruppiMusicali').textContent = result.gruppiMusicali.join(', ');

      // Pre-fill edit form
      document.getElementById('editNome').value = result.nome;
      document.getElementById('editCognome').value = result.cognome;
      document.getElementById('editUsername').value = result.username;
      document.getElementById('editEmail').value = result.email;
      document.getElementById('editEta').value = result.eta;
      document.getElementById('editPreferenzeMusicali').value = result.preferenzeMusicali.join(', ');
      document.getElementById('editGruppiMusicali').value = result.gruppiMusicali.join(', ');
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Si è verificato un errore durante il recupero dei dati del profilo');
  }
});

document.getElementById('editProfile').addEventListener('click', function() {
  document.getElementById('editFormContainer').style.display = 'block';
});

document.getElementById('updateForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const nome = document.getElementById('editNome').value;
  const cognome = document.getElementById('editCognome').value;
  const username = document.getElementById('editUsername').value;
  const email = document.getElementById('editEmail').value;
  const eta = document.getElementById('editEta').value;
  const preferenzeMusicali = document.getElementById('editPreferenzeMusicali').value.split(', ');
  const gruppiMusicali = document.getElementById('editGruppiMusicali').value.split(', ');

  const updatedData = {
    nome,
    cognome,
    username,
    email,
    eta,
    preferenzeMusicali,
    gruppiMusicali
  };

  try {
    const response = await fetch('http://127.0.0.1:3000/api/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedData)
    });

    const result = await response.json();
    if (response.ok) {
      alert('Dati aggiornati con successo');
      window.location.reload();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Si è verificato un errore durante l\'aggiornamento dei dati');
  }
});

document.getElementById('deleteAccount').addEventListener('click', async function() {
  if (confirm('Sei sicuro di voler eliminare il tuo account?')) {
    try {
      const response = await fetch('http://127.0.0.1:3000/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      if (response.ok) {
        alert('Account eliminato con successo');
        localStorage.removeItem('token');
        window.location.href = 'register.html';
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Si è verificato un errore durante l\'eliminazione dell\'account');
    }
  }
});

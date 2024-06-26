// Gestione registrazione
document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const cognome = document.getElementById('cognome').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const eta = document.getElementById('eta').value;
  const preferenzeMusicali = document.getElementById('preferenzeMusicali').value.split(',');
  const gruppiMusicali = document.getElementById('gruppiMusicali').value.split(',');

  const data = {
    nome,
    cognome,
    username,
    email,
    password,
    eta,
    preferenzeMusicali,
    gruppiMusicali
  };

  console.log('Registration data:', data); // Log registration data

  try {
    const response = await fetch('http://127.0.0.1:3000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log('Registration response:', response); // Log the response
    if (response.ok) {
      alert('Registrazione completata con successo');
      window.location.href = 'login.html'; // Reindirizzamento alla pagina di login
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Si è verificato un errore durante la registrazione');
  }
});

// Gestione login
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const data = { email, password };

  console.log('Login data:', data); // Log login data

  try {
    const response = await fetch('http://127.0.0.1:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log('Response:', response); // Log the response
    const result = await response.json();
    console.log('Result:', result); // Log the result
    if (response.ok) {
      alert('Login eseguito con successo');
      localStorage.setItem('token', result.token); // Save the token
      window.location.href = 'profile.html'; // Redirect to profile page
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Si è verificato un errore durante il login');
  }
});

// Gestione aggiornamento
document.getElementById('updateForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const cognome = document.getElementById('cognome').value;
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const eta = document.getElementById('eta').value;
  const preferenzeMusicali = document.getElementById('preferenzeMusicali').value.split(',');
  const gruppiMusicali = document.getElementById('gruppiMusicali').value.split(',');

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
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if needed
      },
      body: JSON.stringify({ email, updatedData })
    });

    const result = await response.json();
    if (response.ok) {
      alert('Dati aggiornati con successo');
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Si è verificato un errore durante l\'aggiornamento dei dati');
  }
});

// Gestione eliminazione account
document.getElementById('deleteAccount')?.addEventListener('click', async function() {
  const email = document.getElementById('email').value;

  if (confirm('Sei sicuro di voler eliminare il tuo account?')) {
    try {
      const response = await fetch('http://127.0.0.1:3000/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add token if needed
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      if (response.ok) {
        alert('Account eliminato con successo');
        localStorage.removeItem('token');
        window.location.href = 'register.html'; // Redirect to register page or any other page
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Si è verificato un errore durante l\'eliminazione dell\'account');
    }
  }
});

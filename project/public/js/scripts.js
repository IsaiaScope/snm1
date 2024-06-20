document.getElementById('registerForm').addEventListener('submit', async function(e) {
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

  try {
    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (response.ok) {
      alert('Registrazione completata con successo');
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Si è verificato un errore durante la registrazione');
  }
});

async function fetchCurrentTime() {
  try {
    const response = await fetch('time.php');
    const data = await response.json();

    if (data.success) {

      const date = new Date(data.currentTime);
      document.getElementById('timeDisplay').textContent = date.toLocaleString();
    } else {
      document.getElementById('timeDisplay').textContent = 'Error: ' + data.error;
    }
  } catch (error) {
    document.getElementById('timeDisplay').textContent = 'Fetch error: ' + error;
  }
}


setInterval(fetchCurrentTime, 1000);
fetchCurrentTime();

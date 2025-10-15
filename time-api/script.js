// Function to fetch current time from PHP API
async function fetchCurrentTime() {
  try {
    const response = await fetch('time.php');
    const data = await response.json();

    if (data.success) {
      // Format the time nicely
      const date = new Date(data.currentTime);
      document.getElementById('timeDisplay').textContent = date.toLocaleString();
    } else {
      document.getElementById('timeDisplay').textContent = 'Error: ' + data.error;
    }
  } catch (error) {
    document.getElementById('timeDisplay').textContent = 'Fetch error: ' + error;
  }
}

// Call function every second to update time
setInterval(fetchCurrentTime, 1000);
fetchCurrentTime(); // initial call

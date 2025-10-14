// Function to generate a random color in hexadecimal format
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

// Function to change the background color and log the hexadecimal value
function changeBackgroundColor() {
  const randomColor = getRandomColor();
  document.body.style.backgroundColor = randomColor;
}

// Add an event listener to the button to trigger the color change
const colorButton = document.getElementById('colorButton');
colorButton.addEventListener('click', changeBackgroundColor);
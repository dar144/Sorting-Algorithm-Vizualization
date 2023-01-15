let intervalId;
var canvas = document.getElementById("bubble-sort");
var ctx = canvas.getContext("2d");
// ctx.clearRect(0, 0, canvas.width, canvas.height);

// Set the number of bars in the animation
var numBars = 20;

// Create an array of random heights for the bars
var barHeights = new Array(numBars);
// for (var i = 0; i < numBars; i++) {
// 	barHeights[i] = Math.floor(Math.random() * canvas.height);
// }

// Draw the bars on the canvas with numbers above them
function drawBars() {
	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var barWidth = canvas.width / numBars;
	for (var i = 0; i < numBars; i++) {
		ctx.fillStyle = "#415A77";
		ctx.fillRect(i * barWidth, canvas.height - barHeights[i], barWidth - 1, barHeights[i]);
	}
}

// Perform a single pass of the bubble sort algorithm
function bubbleSortPass() {
	var swapped = false;
	for (var i = 0; i < numBars - 1; i++) {
		if (barHeights[i] > barHeights[i + 1]) {
			var temp = barHeights[i];
			barHeights[i] = barHeights[i + 1];
			barHeights[i + 1] = temp;
			swapped = true;
		}
	}
	if (!swapped) {
		clearInterval(intervalId);
	}
	drawBars();
}

// Start the animation
function clickBubbleSort() {
	intervalId && clearInterval(intervalId);
	for (var i = 0; i < numBars; i++) {
		barHeights[i] = Math.floor(Math.random() * canvas.height);
	}
	
	drawBars();
	intervalId = setInterval(bubbleSortPass, 100);
}
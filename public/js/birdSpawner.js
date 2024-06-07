import { $ } from "./app.js";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateDistance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}
function calculateAngle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}
function getRandomEdgePosition(excludeEdge = null, offset = 50) {
  let edge;
  do {
    edge = getRandomInt(0, 3);
  } while (edge === excludeEdge);

  let x, y;
  switch (edge) {
    case 0: // Top edge
      x = getRandomInt(0, window.innerWidth);
      y = -offset;
      break;
    case 1: // Right edge
      x = window.innerWidth + offset;
      y = getRandomInt(0, window.innerHeight);
      break;
    case 2: // Bottom edge
      x = getRandomInt(0, window.innerWidth);
      y = window.innerHeight + offset;
      break;
    case 3: // Left edge
      x = -offset;
      y = getRandomInt(0, window.innerHeight);
      break;
  }
  return { x, y, edge };
}

function spawnBird() {
  const bird_div = document.createElement("div");
  bird_div.className = "bird-div";

  const startPos = getRandomEdgePosition();
  const endPos = getRandomEdgePosition(startPos.edge);

  const distance = calculateDistance(
    startPos.x,
    startPos.y,
    endPos.x,
    endPos.y
  );
  const velocity = 280; // Pixels per second
  const duration = distance / velocity; // Duration in seconds
  const angle = calculateAngle(startPos.x, startPos.y, endPos.x, endPos.y);

  bird_div.style.left = `${startPos.x}px`;
  bird_div.style.top = `${startPos.y}px`;
  bird_div.style.setProperty("--endX", `${endPos.x - startPos.x}px`);
  bird_div.style.setProperty("--endY", `${endPos.y - startPos.y}px`);
  bird_div.style.setProperty("--startAngle", `${angle}deg`);
  bird_div.style.setProperty("--endAngle", `${angle}deg`);
  bird_div.style.animation = `bird-move ${duration}s linear`;

  $("#birdSpawner").appendChild(bird_div);

  bird_div.addEventListener("animationend", () => {
    bird_div.remove();
  });
}

let intervalId;

function startSpawning() {
  const spawnRatePercent = 10;
  intervalId = setInterval(() => {
    if (Math.random() < spawnRatePercent / 100 && !document.hidden) {
      console.log("spawning..");
      spawnBird();
    }
  }, 1000); // Check every second
}

function stopSpawning() {
  clearInterval(intervalId);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopSpawning();
  } else {
    startSpawning();
  }
});

startSpawning();

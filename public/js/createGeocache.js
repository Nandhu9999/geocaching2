import { $ } from "./app.js";
import GeocacheApi from "./api/geocache.js";
import { getUserLocation } from "./mapScript.js";

function openCamera() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = $("video");
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log("Something went wrong: " + err);
      });
  }
}

function takePhoto() {
  try {
    const video = $("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const size = Math.min(video.videoWidth, video.videoHeight);

    const maxDimension = 512;
    const scale = Math.min(maxDimension / size, 1);

    // Set canvas size to the scaled size
    canvas.width = size * scale;
    canvas.height = size * scale;

    // Calculate the top-left corner coordinates to crop the center square
    const xOffset = (video.videoWidth - size) / 2;
    const yOffset = (video.videoHeight - size) / 2;

    // Draw the center square of the video frame on the canvas, scaled to fit within 512x512
    context.drawImage(
      video,
      xOffset,
      yOffset,
      size,
      size,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Get the image data URL
    const imageUrl = canvas.toDataURL("image/png");

    // Display the photo
    const photo = $("#photo");
    photo.src = imageUrl;
    photo.style.display = "block";
    video.style.display = "none";
    return { success: true, imageUrl };
  } catch (err) {
    return { success: false, error: err };
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  openCamera();

  const captureBtn = $("#captureBtn");
  captureBtn.addEventListener("click", async () => {
    const geocacheName = $("#geocacheNameInput").value;
    if (!geocacheName) {
      $("#statusBox").innerHTML = "Tree name cannot be empty";
      return;
    }
    // get location
    $("#statusBox").innerHTML = "Loading...";
    $("#captureBtn").style.pointerEvents = "none";
    $("#captureBtn").innerHTML =
      "<div style='border-color: grey; border-top-color:white;' class='w-8 h-8 rounded-full border-4 animate-spin'></div>";
    const locationResponse = await getUserLocation();
    const userLocation = { lat: 0, lng: 0 };
    if (locationResponse.status === "success") {
      userLocation.lat = locationResponse.lat;
      userLocation.lng = locationResponse.lng;
    } else {
      $("#statusBox").innerHTML = `Error: ${locationResponse.error}`;
      $("#captureBtn").innerHTML = "Failed";
      return;
    }
    // capture image
    const photoStatus = takePhoto();
    if (photoStatus.success) {
      // post image url
      const response = await GeocacheApi.postNewGeocache(
        photoStatus.imageUrl,
        geocacheName,
        userLocation
      );
      if (response.success) {
        if (response.isValid) {
          // notify success
          $("#statusBox").innerHTML = "✅ New Tree added";
          $("#captureBtn").innerHTML = "Submitted";
          setTimeout(() => {
            window.location.href = "/game";
          }, 1000);
        } else {
          // notify error
          $("#statusBox").innerHTML = `Error: It is an Invalid Tree!`;
          $("#captureBtn").innerHTML = "Retry";
          $("#captureBtn").style.pointerEvents = "auto";
          $("#captureBtn").removeEventListener("click", null);
          $("#captureBtn").addEventListener("click", () => {
            window.location.href = "/create";
          });
        }
      } else {
        // notify error
        $("#statusBox").innerHTML = `Error: ${response.error}`;
        $("#captureBtn").innerHTML = "Retry";
        $("#captureBtn").style.pointerEvents = "auto";
        $("#captureBtn").removeEventListener("click", null);
        $("#captureBtn").addEventListener("click", () => {
          window.location.href = "/create";
        });
      }
    } else {
      // notify error
      $("#statusBox").innerHTML = `Error: ${photoStatus.error}`;
      $("#captureBtn").innerHTML = "Retry";
      $("#captureBtn").style.pointerEvents = "auto";
      $("#captureBtn").removeEventListener("click", null);
      $("#captureBtn").addEventListener("click", () => {
        window.location.href = "/create";
      });
    }
  });
});

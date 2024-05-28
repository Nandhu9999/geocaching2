import { TREES_LIST } from "./config.js";
import { $ } from "./app.js";
import {
  addTreeMarkerToMap,
  getUserLocation,
  updateMapView,
  disableMapControl,
  updateUserLocation,
} from "./mapScript.js";

TREES_LIST.forEach((treeItem, idx) => {
  const randomlySelected = Math.floor(Math.random() * 5) === 0;
  if (randomlySelected) {
    const location = treeItem.coords.split(",");
    addTreeMarkerToMap(idx, location, "", TREE_CLICKED);
  }
});

function TREE_CLICKED(idx) {
  console.log("Clicked", idx);
  const questionPopup = $("#questionPopup");
  questionPopup.classList.remove("hidden");
  questionPopup.querySelector("#question").innerText = `What is life?`;
  const optionsHolder = questionPopup.querySelector("#options");
  const templateButton = optionsHolder.querySelector("#buttonTemplate");
  optionsHolder.innerHTML = null;
  const optionsList = [
    "abc abc abc abc",
    "bcd bcd bcd bcd bcd bcd bcd",
    "cde cde cde cde cde cde cde cde cde",
    "def def def def def def def def def",
  ];
  optionsList.forEach((optionText) => {
    const optionButton = templateButton.cloneNode(true);
    optionButton.innerText = optionText;
    optionButton.classList.remove("hidden");
    optionsHolder.appendChild(optionButton);
  });
  optionsHolder.appendChild(templateButton);
}

async function getUserCurrentLocation() {
  const location = await getUserLocation();
  console.log(location);
  if (location.status == "success") {
    const locationPermissionPopup = $("#locationPermissionPopup");
    locationPermissionPopup.querySelector("button").innerText = "Accepted";
    setTimeout(() => {
      locationPermissionPopup.classList.add("hidden");
    }, 200);
  } else {
    locationPermissionPopup.classList.remove("hidden");
  }
}

const UserLocations = {
  last: {},
  list: [],
  add: function (obj) {
    this.list.push(obj);
    this.last = obj;
    if (this.list.length > 3) {
      this.list.splice(0, 1);
    }
  },
};

async function GEOLOCATION_UPDATED(pos) {
  UserLocations.add({
    valid: true,
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
  });

  // update live location on map
  if (UserLocations.last.valid && $("#liveLocationSetting")?.checked) {
    updateUserLocation([UserLocations.last.lat, UserLocations.last.lng], 5);
    updateMapView([UserLocations.last.lat, UserLocations.last.lng]);
  }

  // current Time
  const currentDateTime = new Date();
  var hours = currentDateTime.getHours();
  var minutes = currentDateTime.getMinutes();
  var seconds = currentDateTime.getSeconds();
  var suffix = "am";
  if (hours > 12) {
    hours = hours - 12;
    suffix = "pm";
  }
  hours = hours > 9 ? hours : "0" + hours;
  minutes = minutes > 9 ? minutes : "0" + minutes;
  seconds = seconds > 9 ? seconds : "0" + seconds;
  const timeDisplay0 = `  ${hours}:${minutes}${suffix}`;
  const timeDisplay1 = `${hours}:${minutes}:${seconds}${suffix}`;
  $("#currentTime").innerHTML = `${
    hours == 0 ? "12" : hours
  }<span class="time-pulse">:</span>${minutes}${suffix}`;
}

function closeQuesitonPopup() {
  $("#questionPopup").classList.add("hidden");
}

function READ_ERROR(err) {
  console.error(`ERROR(${err.code}): ${err.message}`);
}

function Main() {
  getUserCurrentLocation();
  // setInterval(gameLoop, 1000);
  navigator.geolocation.watchPosition(GEOLOCATION_UPDATED, READ_ERROR, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  });

  $("#questionPopup .quitButton").addEventListener("click", () => {
    closeQuesitonPopup();
  });

  $("#liveLocationSetting")?.addEventListener("input", (e) => {
    if (e.target.checked) {
      updateMapView([UserLocations.last.lat, UserLocations.last.lng]);
      disableMapControl(true);
    } else {
      updateMapView([UserLocations.last.lat, UserLocations.last.lng], 19);
      disableMapControl(false);
    }
  });
}
Main();

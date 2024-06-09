// import { TREES_LIST } from "./config.js";
import { $ } from "./app.js";
import {
  addTreeMarkerToMap,
  getUserLocation,
  updateMapView,
  disableMapControl,
  updateUserLocation,
  getMapCenter,
  moveMapTo,
} from "./mapScript.js";
import GeocacheApi from "./api/geocache.js";
import GameApi from "./api/game.js";

const TREES_LIST = await GeocacheApi.getGeocaches();
TREES_LIST.forEach((treeItem, idx) => {
  if (treeItem.scientific_name == "tree") {
    const iconUrl = "/assets/game/tree_golden.png";
    addTreeMarkerToMap(
      idx,
      treeItem.scientific_name,
      iconUrl,
      [treeItem.lat, treeItem.lng],
      "",
      TREE_CLICKED
    );
  } else {
    const randomlySelected = Math.floor(Math.random() * 5) === 0;
    const iconUrl = "/assets/game/tree.png";
    if (randomlySelected) {
      addTreeMarkerToMap(
        idx,
        treeItem.scientific_name,
        iconUrl,
        [treeItem.lat, treeItem.lng],
        "",
        TREE_CLICKED
      );
    }
  }
});

async function TREE_CLICKED(idx, scientific_name, location) {
  console.log("Clicked", idx);
  // GET QUESTION
  const quizResponse = await GameApi.getGeocacheQuiz(idx);
  if (!quizResponse.quiz) return;

  UserLocations.beforeGeocacheClick = getMapCenter();
  moveMapTo(location);

  const questionPopup = $("#questionPopup");
  questionPopup.classList.remove("hidden");

  questionPopup.querySelector("#question").innerText =
    quizResponse.quiz.question;
  const optionsHolder = questionPopup.querySelector("#options");
  optionsHolder.innerHTML = "";
  const optionsList = quizResponse.quiz.options.split(",");
  optionsList.forEach((optionText) => {
    // const optionButton = templateButton.cloneNode(true);
    const optionButton = document.createElement("div");
    optionButton.innerText = optionText;
    optionButton.classList =
      "text-gray-600 p-2 select-none cursor-pointer rounded-lg mb-3 bg-gradient-to-r from-gray-100 to-gray-300 opacity-65 active:from-gray-300 active:to-gray-100 ring-black ring-offset-1 ring-2";
    optionButton.addEventListener("click", () => {
      TREE_OPTION_SUBMISSION(scientific_name, quizResponse.quiz.id, optionText);
    });
    optionsHolder.appendChild(optionButton);
  });
}
async function TREE_OPTION_SUBMISSION(scientific_name, quiz_id, user_answer) {
  const response = await GameApi.submitGeocacheQuiz(
    scientific_name,
    quiz_id,
    user_answer
  );
  if (response.success) {
    if (response.isCorrect) {
      // SUCCESS
      console.log("celebrate, right answer...");
      closeQuesitonPopup();
      party.confetti($("#map"), {
        debug: false,
        gravity: 800,
        zIndex: 99999,
        count: party.variation.range(50, 80),
      });
    } else {
      console.log("incorrect answer...");
      $("#map").classList.add("shake-screen");
      navigator.vibrate([100, 50, 100, 50, 300]);
      setTimeout(() => {
        $("#map").classList.remove("shake-screen");
      }, 500);
      closeQuesitonPopup();
    }
  } else {
    // error
    console.log(response.error);
    closeQuesitonPopup();
  }
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
  beforeGeocacheClick: {
    lat: 0,
    lng: 0,
  },
};

async function GEOLOCATION_UPDATED(pos) {
  UserLocations.add({
    valid: true,
    lat: pos.coords.latitude,
    lng: pos.coords.longitude,
  });

  // update live location on map
  if ($("#liveLocationSetting")) {
    // ADMIN
    if (UserLocations.last.valid && $("#liveLocationSetting")?.checked) {
      updateUserLocation([UserLocations.last.lat, UserLocations.last.lng], 5);
      updateMapView([UserLocations.last.lat, UserLocations.last.lng]);
    }
  } else {
    // NORMAL USER
    if (UserLocations.last.valid) {
      updateUserLocation([UserLocations.last.lat, UserLocations.last.lng], 5);
      updateMapView([UserLocations.last.lat, UserLocations.last.lng]);
    }
  }

  // current Time
  const currentDateTime = new Date();
  var hours = currentDateTime.getHours();
  var minutes = currentDateTime.getMinutes();
  var seconds = currentDateTime.getSeconds();
  let suffix = " AM";
  if (hours >= 12) {
    suffix = " PM";
    hours = hours - 12;
  }
  hours = hours > 9 ? hours : "0" + hours;
  minutes = minutes > 9 ? minutes : "0" + minutes;
  seconds = seconds > 9 ? seconds : "0" + seconds;
  // const timeDisplay0 = `  ${hours}:${minutes}${suffix}`;
  // const timeDisplay1 = `${hours}:${minutes}:${seconds}${suffix}`;
  $("#currentTime").innerHTML = `${
    hours == 0 ? "12" : hours
  }<span class="time-pulse">:</span>${minutes}${suffix}`;
}

function closeQuesitonPopup() {
  const location = [
    UserLocations.beforeGeocacheClick.lat,
    UserLocations.beforeGeocacheClick.lng,
  ];
  moveMapTo(location);
  $("#questionPopup").classList.add("hidden");
}

function READ_ERROR(err) {
  console.error(`ERROR(${err.code}): ${err.message}`);
}

function Main() {
  // GAME START
  getUserCurrentLocation();

  // setInterval(gameLoop, 1000);
  navigator.geolocation.watchPosition(GEOLOCATION_UPDATED, READ_ERROR, {
    enableHighAccuracy: true,
    timeout: 10_000,
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

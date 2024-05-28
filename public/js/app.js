export function $(x) {
  return document.querySelector(x);
}
function requestLocationAccess() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords; // Do something with the coordinates
      console.log(latitude, longitude);
      document.querySelector("#locationPermissionPopup").style.display = "none";
    },
    (error) => {
      const erroCodesList = [
        "",
        "PERMISSION_DENIED",
        "POSITION_UNAVAILABLE",
        "TIMEOUT",
      ];
      document.querySelector("#locationPermissionPopup .error").innerHTML =
        `<b style="text-align:center;">[${
          erroCodesList[error.code]
        } ERROR]</b>` +
        "<br />" +
        "<ul style='width:90%;'><li style='list-style:disc;'>Check your Internet Connection</li><li style='list-style:disc;'>Check your device location capabilities</li><li style='list-style:disc;'>Wait for location calibration</li></ul>";
      console.error(error); // Handle the error
    }
  );
}

// On /game For Location Permission
if (requestLocationAccess) {
  $("#locationAcceptButton")?.addEventListener("click", requestLocationAccess);
}

function gameMenuTriggered() {
  const sideBar = document.querySelector("#sideBar");
  sideBar.classList.toggle("activated");
  if (sideBar.classList.contains("activated")) {
    sideBar.classList.add("translate-x-0");
    sideBar.classList.remove("translate-x-[-300px]");
    $("#gameNavbar").classList.add("translate-x-[300px]");
    $("#contentWrapper").classList.add("translate-x-[300px]");
    contentOverlay.classList.remove("hidden");
  } else {
    sideBar.classList.remove("translate-x-0");
    sideBar.classList.add("translate-x-[-300px]");
    $("#gameNavbar").classList.remove("translate-x-[300px]");
    $("#contentWrapper").classList.remove("translate-x-[300px]");
    contentOverlay.classList.add("hidden");
  }
}
const gameMenuButton = $("#gameMenuButton");
const contentOverlay = $("#contentOverlay");
gameMenuButton.addEventListener("click", gameMenuTriggered);
contentOverlay.addEventListener("click", gameMenuTriggered);

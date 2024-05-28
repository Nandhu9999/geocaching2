import { $ } from "./app.js";

const UNI_LOCATION = [10.8993923, 76.9029521];
const MAX_MAP_ZOOM = 20;
const ICON_SIZE = [50, 50];

var map = L.map("map");
map.setView(UNI_LOCATION, MAX_MAP_ZOOM);
L.tileLayer("http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}", {
  maxZoom: MAX_MAP_ZOOM,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
}).addTo(map);

export function disableMapControl(state) {
  console.log("disable map control", state);
  if (state) {
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.dragging.disable();
  } else if (!state) {
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    map.dragging.enable();
  }
}
$(".leaflet-control-zoom").style.visibility = "hidden";
$(".leaflet-control-attribution").style.visibility = "hidden";

export function addTreeMarkerToMap(idx, location, popupText, onClick) {
  var treeIcon = L.icon({
    iconUrl: "/assets/game/tree.png",
    shadowUrl: "/assets/game/shadow.png",
    iconSize: ICON_SIZE,
    shadowSize: ICON_SIZE,
    iconAnchor: ICON_SIZE.map((i) => i / 2),
    shadowAnchor: [ICON_SIZE[0] / 2, ICON_SIZE[0] / 2 - 5],
    popupAnchor: [0, -25],
  });

  const marker = L.marker(location, { icon: treeIcon })
    .on("click", () => {
      marker._icon.classList.add("customMarkerAnimation");
      onClick(idx);
      setTimeout(() => {
        marker._icon.classList.remove("customMarkerAnimation");
      }, 3000);
    })
    .addTo(map);

  if (popupText) {
    marker.bindPopup(
      `<h1 style="font-weight:700;font-size:1.25rem;">#${idx}</h1>` + popupText
    );
  }
}

export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const response = {
            status: "success",
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(response);
        },
        function (error) {
          resolve({
            status: "error",
            error: error.message,
          });
        }
      );
    } else {
      resolve({
        status: "error",
        error: "Geolocation is not supported by this browser.",
      });
    }
  });
}
export function updateMapView(location, zoom = MAX_MAP_ZOOM) {
  map.setView(location, zoom);
}
export function updateUserLocation(location, distance) {
  if (userCircle) {
    map.removeLayer(userCircle);
  }
  userCircle = L.circle(location, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.25,
    radius: distance || 50,
  }).addTo(map);
}
let userCircle = undefined;

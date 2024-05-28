function toggleLanguageDropdown() {
  var dropdown = document.getElementById("languageDropdown");
  if (dropdown.classList.contains("hidden")) {
    dropdown.classList.remove("hidden");
  } else {
    dropdown.classList.add("hidden");
  }
}
function languageSelected(lang) {
  var dropdown = document.getElementById("languageDropdown");
  var button = document.getElementById("languageDropdownButtonText");
  var flagDisplay = document.getElementById("dropdownFlagOption");
  switch (lang) {
    case "english":
      flagDisplay.innerText = "🇺🇸";
      button.innerText = "English";
      break;
    case "tamil":
      flagDisplay.innerText = "🇮🇳";
      button.innerText = "தமிழ்";
      break;
    case "telugu":
      flagDisplay.innerText = "🇮🇳";
      button.innerText = "తెలుగు";
      break;
    case "malayalam":
      flagDisplay.innerText = "🇮🇳";
      button.innerText = "മലയാളം";
      break;
  }
  dropdown.classList.add("hidden");
}

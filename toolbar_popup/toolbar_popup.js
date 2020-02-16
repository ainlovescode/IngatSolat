const PRAYER_NAMES = ["Fajr", "Syuruk", "Dhuhr", "Asr", "Maghrib", "Isha"];
const ALARM_BUTTON_IDS = [
  "fajr_alarm_button",
  "syuruk_alarm_button",
  "dhuhr_alarm_button",
  "asr_alarm_button",
  "maghrib_alarm_button",
  "isha_alarm_button"
];
const ADJUSTED_TIME = [
  "fajr_adjusted_time",
  "syuruk_adjusted_time",
  "dhuhr_adjusted_time",
  "asr_adjusted_time",
  "maghrib_adjusted_time",
  "isha_adjusted_time"
];

document.addEventListener("DOMContentLoaded", function() {
  var configureButton = document.getElementById("configure-button");

  configureButton.addEventListener("click", function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage(callback);
    } else {
      window.open(chrome.runtime.getURL("configure.html"));
    }
  });
});

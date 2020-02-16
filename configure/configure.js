import { PrayerTimeUpdater } from "./PrayerTimeUpdater.js";

const PRAYER_NAMES = ["Fajr", "Syuruk", "Dhuhr", "Asr", "Maghrib", "Isha"];
const NUM_OF_PRAYERS = 6;
var ALARM_BUTTON_IDS = [
  "fajr_alarm_button",
  "syuruk_alarm_button",
  "dhuhr_alarm_button",
  "asr_alarm_button",
  "maghrib_alarm_button",
  "isha_alarm_button"
];
var ADJUSTED_TIME = [
  "fajr_adjusted_time",
  "syuruk_adjusted_time",
  "dhuhr_adjusted_time",
  "asr_adjusted_time",
  "maghrib_adjusted_time",
  "isha_adjusted_time"
];
var OFFSET_FIELDS = [
  "fajr_offset_field",
  "syuruk_offset_field",
  "dhuhr_offset_field",
  "asr_offset_field",
  "maghrib_offset_field",
  "isha_offset_field"
];
var OFFSET_BUTTONS = [
  "fajr_offset_button",
  "syuruk_offset_button",
  "dhuhr_offset_button",
  "asr_offset_button",
  "maghrib_offset_button",
  "isha_offset_button"
];

function mapIdToDocument(item, index, arr) {
  arr[index] = document.getElementById(item);
}

document.addEventListener("DOMContentLoaded", function() {
  var date = new Date();
  var curr_day = date.getDate();

  var prayerTimeUpdater = new PrayerTimeUpdater();

  ALARM_BUTTON_IDS.forEach(mapIdToDocument);
  ADJUSTED_TIME.forEach(mapIdToDocument);
  OFFSET_FIELDS.forEach(mapIdToDocument);
  OFFSET_BUTTONS.forEach(mapIdToDocument);

  /* 
  chrome.storage.sync.get(null, function(result) {
    if (result.fajr_alarm == true) {
      fajr_alarm_button.style.backgroundImage =
        "url('../assets/images/alarm_on.png')";
      console.log("subuh_alarm_setting initialised to " + true);
    } else {
      fajr_alarm_button.style.backgroundImage =
        "url('../assets/images/alarm_off.png')";
      console.log("subuh_alarm_setting initialised to " + false);
    }

    fajr_adjusted_time.innerHTML =
      result.month_data_key[String(curr_day)]["Fajr"];

    if (result.fajr_offset_key != null) {
      fajr_offset_field.value = result.fajr_offset_key;
    } else {
      fajr_offset_field.value = 0;
    }
  });

  fajr_alarm_button.addEventListener("click", function() {
    chrome.storage.sync.get("fajr_alarm", function(result) {
      if (result.fajr_alarm == true) {
        fajr_alarm_button.style.backgroundImage =
          "url('../assets/images/alarm_off.png')";
        chrome.storage.sync.set({ fajr_alarm: false }, function() {
          console.log("fajr_alarm_setting is set to " + false);
        });
      } else {
        fajr_alarm_button.style.backgroundImage =
          "url('../assets/images/alarm_on.png')";
        chrome.storage.sync.set({ fajr_alarm: true }, function() {
          console.log("fajr_alarm_setting is set to " + true);
        });
      }
    });
  });

  fajr_offset_button.addEventListener("click", function() {
    chrome.storage.sync.set(
      { fajr_offset_key: fajr_offset_field.value },
      function() {
        console.log("fajr_offset set to " + fajr_offset_field.value);
      }
    );

    prayerTimeUpdater.update_adjusted_time("Fajr");

    chrome.storage.sync.get("month_data_key", function(result) {
      console.log(result.month_data_key[String(curr_day)]["Fajr"]);
      console.log(
        "curr_Day is: " +
          String(curr_day) +
          "for fajr time: " +
          result.month_data_key[String(curr_day)]["Fajr"]
      );
      fajr_adjusted_time.innerHTML =
        result.month_data_key[String(curr_day)]["Fajr"];
    });
  });
  */

  var save_config_button = document.getElementById("save_config_button");
  save_config_button.addEventListener("click", function() {
    alert(
      "Configuration saved! \nClick on Close Menu to return to the previous page."
    );
  });

  var close_menu_button = document.getElementById("close_menu_button");
  close_menu_button.addEventListener("click", function() {
    chrome.tabs.getCurrent(function(tab) {
      chrome.tabs.remove(tab.id, function() {});
    });
  });
});

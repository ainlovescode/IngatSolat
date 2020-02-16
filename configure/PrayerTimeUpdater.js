export class PrayerTimeUpdater {
  // this class is used to maintain prayer time settings from configuration menu

  constructor() {
    const date = new Date();
    this.curr_month = date.getMonth() + 1;
    this.curr_year = date.getFullYear();

    this.fajr_offset = 0;
    this.syuruk_offset = 0;
    this.dhuhr_offset = 0;
    this.asr_offset = 0;
    this.maghrib_offset = 0;
    this.isha_offset = 0;

    this.month_of_data = null;
    this.year_of_data = null;
    this.current_month_data = null;

    this.get_data(
      this.curr_month,
      this.curr_year,
      this.month_of_data,
      this.year_of_data,
      this.current_month_data,
      [
        this.fajr_offset,
        this.syuruk_offset,
        this.dhuhr_offset,
        this.asr_offset,
        this.maghrib_offset,
        this.isha_offset
      ],
      this.get_new_month_data,
      this.renew_api_link
    );
  }

  get_data(
    browser_month,
    browser_year,
    data_month,
    data_year,
    curr_data,
    offsets,
    get_new_data,
    renew_api
  ) {
    // check month_validity, then get current or new data

    chrome.storage.sync.get(null, function(result) {
      data_month = result.curr_month_key;
      data_year = result.curr_year_key;
      console.log(
        `data_month = ${data_month}, browser_month = ${browser_month}`
      );
      if ((browser_month != data_month) | (browser_year != data_year)) {
        console.log(`Data is old. Retrieving new prayer times `);
        get_new_data(
          browser_month,
          browser_year,
          curr_data,
          offsets,
          renew_api
        );
      } else {
        curr_data = result.month_data_key;
        console.log(curr_data);
      }
    });
  }

  get_new_month_data(month_query, year_query, data_query, offsets, renew_api) {
    // simply process raw data from api, then save month-year-times of prayer times in storage

    renew_api(month_query, year_query, data_query, offsets, function(
      data_q,
      api_link
    ) {
      console.log("Attempting to get new data from " + api_link);

      var xhr = new XMLHttpRequest();
      xhr.open("GET", api_link, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          const PRAYER_NAMES = [
            "Fajr",
            "Sunrise",
            "Dhuhr",
            "Asr",
            "Maghrib",
            "Isha"
          ];
          var month_data = JSON.parse(xhr.responseText).data;

          var updated_month_data = {};

          for (var k = 0; k < month_data.length; k++) {
            var day_number = k + 1;

            var day_timings = {};
            var prayer_timings = month_data[k].timings;
            for (
              var prayer_idx = 0;
              prayer_idx < PRAYER_NAMES.length;
              prayer_idx++
            ) {
              var prayer_name = PRAYER_NAMES[prayer_idx];

              var prayer_timing = prayer_timings[prayer_name].split(" ")[0];

              day_timings[prayer_name] = prayer_timing;
            }

            updated_month_data[day_number] = day_timings;
          }

          data_query = updated_month_data;

          chrome.storage.sync.set(
            {
              month_data_key: updated_month_data,
              curr_month_key: month_query,
              curr_year_key: year_query
            },
            function() {
              console.log(
                `Raw API data for ${month_query}/${year_query} ` +
                  `for Singapore, Singapore processed and saved.`
              );
            }
          );
        }
      };
      xhr.send();
    });
  }

  renew_api_link(month_q, year_q, data_q, offsets, callback) {
    // this method renews the API link to get raw data

    chrome.storage.sync.get(null, function(result) {
      offsets[0] = result.fajr_offset_key != null ? result.fajr_offset_key : 0;
      offsets[1] =
        result.syuruk_offset_key != null ? result.syuruk_offset_key : 0;
      offsets[2] =
        result.dhuhr_offset_key != null ? result.dhuhr_offset_key : 0;
      offsets[3] = result.asr_offset_key != null ? result.asr_offset_key : 0;
      offsets[4] =
        result.maghrib_offset_key != null ? result.maghrib_offset_key : 0;
      offsets[5] = result.isha_offset_key != null ? result.isha_offset_key : 0;

      console.log(
        `renew_api -> chrome_storage -> offsets after result: ${offsets}`
      );

      var API_LINK =
        `https://api.aladhan.com/v1/calendarByCity?city=Singapore&country=Singapore` +
        `&method=11&` +
        `month=${month_q}` +
        `&year=${year_q}` +
        `&tune=0,` +
        `${offsets[0]},` +
        `${offsets[1]},` +
        `${offsets[2]},` +
        `${offsets[3]},` +
        `0,` +
        `${offsets[4]},` +
        `${offsets[5]},` +
        `0`;

      console.log("renewed API: " + API_LINK);

      callback(data_q, API_LINK);
    });
  }

  update_offsets(
    fajr_offset,
    syuruk_offset,
    dhuhr_offset,
    asr_offset,
    maghrib_offset,
    isha_offset
  ) {
    chrome.storage.sync.get(null, function(result) {
      fajr_offset = result.fajr_offset_key != null ? result.fajr_offset_key : 0;
      syuruk_offset =
        result.syuruk_offset_key != null ? result.syuruk_offset_key : 0;
      dhuhr_offset =
        result.dhuhr_offset_key != null ? result.dhuhr_offset_key : 0;
      asr_offset = result.asr_offset_key != null ? result.asr_offset_key : 0;
      maghrib_offset =
        result.maghrib_offset_key != null ? result.maghrib_offset_key : 0;
      isha_offset = result.isha_offset_key != null ? result.isha_offset_key : 0;

      console.log(
        `retrieved offsets from storage. fajr: ${fajr_offset} syuruk: ${syuruk_offset}`
      );
    });
  }

  calculate_adjusted_time(suggested_time, offset) {
    // returns string adjusted_time = suggested_time + offset

    offset = Number(offset);
    var offset_h =
      offset < 0 ? Math.floor(offset / 60) + 1 : Math.floor(offset / 60);

    var offset_m = offset % 60;

    var time_h = Number(suggested_time.split(":")[0]);
    var time_m = Number(suggested_time.split(":")[1]);

    var calculated_m = time_m + offset_m;

    if (calculated_m < 0) {
      calculated_m += 60;
      offset_h -= 1;
    } else if (calculated_m > 59) {
      offset_h += 1;
      calculated_m -= 60;
    }

    var calculated_h = time_h + offset_h;

    if (calculated_h < 0) {
      calculated_h += 24;
    } else if (calculated_h > 23) {
      calculated_h -= 24;
    }

    if (calculated_m < 10 && calculated_h < 10) {
      return `0${calculated_h}:0${calculated_m}`;
    } else if (calculated_m < 10) {
      return `${calculated_h}:0${calculated_m}`;
    } else if (calculated_h < 10) {
      return `0${calculated_h}:${calculated_m}`;
    } else {
      return `${calculated_h}:${calculated_m}`;
    }
  }
}

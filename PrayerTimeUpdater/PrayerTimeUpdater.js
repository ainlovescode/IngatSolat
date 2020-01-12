export function PrayerTimeUpdater() {
    this.fajr_offset = 0;
    this.syuruk_offset = 0;
    this.dhuhr_offset  = 0;
    this.asr_offset = 0;
    this.maghrib_offset = 0;
    this.isha_offset = 0;

    this.curr_month = 1;
    this.curr_year = 2020;

    // in API_TEMPLATE tune: fajr, syuruk, zuhr, asar, sunset, maghrib, isha,imsak, midnight
    API_TEMPLATE = `http://api.aladhan.com/v1/calendarByCity?\
                            city=Singapore&country=Singapore\
                            &method=11\
                            &month=${this.curr_month}\
                            &year=${this.curr_year}\
                            &tune=${this.fajr_offset},\
                            ${this.syuruk_offset},\
                            ${this.dhuhr_offset},\
                            ${this.asr_offset},\
                            0,
                            ${this.maghrib_offset},\
                            ${this.isha_offset},
                            0, 0`;



    function update_prayers() {
        chrome.storage.sync.get(null, function (result) {
            this.fajr_offset = ((result.fajr_offset_key) != null ? result.fajr_offset_key : 0);
            this.syuruk_offset = ((result.syuruk_offset_key) != null ? result.syuruk_offset_key : 0);
            this.dhuhr_offset = ((result.dhuhr_offset_key) != null ? result.dhuhr_offset_key : 0);
            this.asr_offset = ((result.asr_offset_key) != null ? result.asr_offset_key : 0);
            this.maghrib_offset = ((result.maghrib_offset_key) != null ? result.maghrib_offset_key : 0);
            this.isha_offset = ((result.isha_offset_key) != null ? result.isha_offset_key : 0);
            
            this.curr_month = result.curr_month_key;
            this.curr_year = result.curr_year_key;
        });

        console.log(`Getting data for Singapore, Singapore 
                    for ${this.curr_month} ${this.curr_year}`);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", API_TEMPLATE, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var month_data = JSON.parse(xhr.responseText);

                chrome.storage.sync.set({
                    month_data_key: month_data,
                    curr_month_key: this.curr_month,
                    curr_year_key: this.curr_year
                }, function () {
                    console.log(month_data.data[0]);
                    console.log(`Adjusted times for ${this.curr_month} ${this.curr_year}
                                    for Singapore, Singapore saved.`);
                });
            }
        }
        xhr.send();
    }
}
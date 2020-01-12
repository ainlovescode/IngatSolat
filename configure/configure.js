document.addEventListener('DOMContentLoaded', function () {


    var subuh_alarm_button = document.getElementById('subuh_alarm_button');
    var subuh_offset_button = document.getElementById('subuh-offset-button');
    var subuh_offset_field = document.getElementById('subuh-offset-field');


    chrome.storage.sync.get(null, function (result) {
        if (result.subuh_alarm == true) {
            subuh_alarm_button.style.backgroundImage = "url('../assets/images/alarm_on.png')";
            console.log('subuh_alarm_setting initialised to ' + true);
        } else {
            subuh_alarm_button.style.backgroundImage = "url('../assets/images/alarm_off.png')";
            console.log('subuh_alarm_setting initialised to ' + false);

        }

        if (result.subuh_offset != null) {
            subuh_offset_field.value = result.subuh_offset;
        } else {
            subuh_offset_field.value = 0;
        }

    });

    subuh_alarm_button.addEventListener('click', function () {
        chrome.storage.sync.get("subuh_alarm", function (result) {
            if (result.subuh_alarm == true) {
                subuh_alarm_button.style.backgroundImage = "url('../assets/images/alarm_off.png')";
                chrome.storage.sync.set({ subuh_alarm: false }, function () {
                    console.log('subuh_alarm_setting is set to ' + false);
                });
            } else {
                subuh_alarm_button.style.backgroundImage = "url('../assets/images/alarm_on.png')";
                chrome.storage.sync.set({ subuh_alarm: true }, function () {
                    console.log('subuh_alarm_setting is set to ' + true);
                });

            }

        });  
        
    });

    subuh_offset_button.addEventListener('click', function () {
        chrome.storage.sync.set({ subuh_offset: subuh_offset_field.value }, function () {
            console.log("subuh_offset set to " + subuh_offset_field.value);
        });
    })



    var save_config_button = document.getElementById('save_config_button');
    save_config_button.addEventListener('click', function () {
        alert("Configuration saved! \nClick on Close Menu to return to the previous page.");
    });

    var close_menu_button = document.getElementById('close_menu_button');
    close_menu_button.addEventListener('click', function () {
        chrome.tabs.getCurrent(function (tab) {
            chrome.tabs.remove(tab.id, function () { });
        });
    });
});
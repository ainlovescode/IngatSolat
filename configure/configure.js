document.addEventListener('DOMContentLoaded', function () {

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
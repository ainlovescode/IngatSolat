function callback() {
    console.log("configure menu clicked");
}

document.addEventListener('DOMContentLoaded', function () {
    var configureButton = document.getElementById('configure-button');

    configureButton.addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage(callback);
        } else {
            window.open(chrome.runtime.getURL('configure.html'));
        };
    });
});

/*jshint esversion: 6 */
"use strict";

class StorageItem {
    constructor(key) {
        this.getKey = function () {
            return key;
        };
    }

    get() {
        console.log(`Loading '${this.getKey()}' data from localStorage.`);
        try {
            return window.localStorage.getItem(this.getKey());
        } catch (err) { }
        return undefined;
    }

    set(value) {
        console.log(`Saving '${this.getKey()}' data to localStorage.`);
        try {
            window.localStorage.setItem(this.getKey(), value);
            return true;
        } catch (err) { }
        return false;
    }

    delete() {
        console.log(`Removing '${this.getKey()}' data from localStorage.`);
        try {
            window.localStorage.removeItem(this.getKey());
        } catch (err) { }
    }
}

class ListItem {
    constructor(data) {
        this.id = data[0];
        this.channel_name = data[1];
        this.channel_number = data[4];
    }

    matchName(filter) {
        return this.channel_name.toUpperCase().includes(filter.toUpperCase());
    }

    render(elParent) {
        const div = document.createElement("div");
        {
            div.className = "list-item flex-container flex-row justify-content_spacebetween";
            const divLeft = document.createElement("div");
            {
                divLeft.className = "left flex-container flex-column justify-content_center";
                const divChannelName = document.createElement("div");
                {
                    divChannelName.className = "channel_name";
                    divChannelName.innerHTML = `${this.channel_name}`;
                }
                divLeft.append(divChannelName);
            }
            const divRight = document.createElement("div");
            {
                divRight.className = "right flex-container flex-column justify-content_center";
                const divChannelNumber = document.createElement("button");
                {
                    divChannelNumber.className += "channel_button btn btn-lg fw-bold";
                    divChannelNumber.innerHTML = `${this.channel_number}`;
                    divChannelNumber.toggleAttribute("disabled", true);
                }
                divRight.append(divChannelNumber);
            }
            div.append(divLeft);
            div.append(divRight);
        }
        elParent.append(div);
        this.element = div;
    }

    hide() {
        this.element.style.setProperty("visibility", "collapse");
    }
    show() {
        this.element.style.setProperty("visibility", "visible");
    }
}

/*jshint esversion: 6 */
("use strict");

const serverSetting = new StorageItem("server");
const topicSetting = new StorageItem("topic");

(function main() {
    // Settings Events
    document.getElementById("settings-reset").addEventListener("click", resetSettings);
    document.getElementById("settings-save-exit").addEventListener("click", saveSettings);

    // Load Settings
    if (loadServerSetting() || loadTopicSetting()) {
        setTimeout(turnButtons, 500); // This works now!
    }
})();

function saveSettings() {
    if (serverSetting.set(document.getElementById("serverIPURL").value) || topicSetting.set(document.getElementById("topicText").value)) {
        turnButtons(); // This works!
    }
}
function resetSettings() {
    serverSetting.delete();
    document.getElementById("serverIPURL").value = "";
    topicSetting.delete();
    document.getElementById("topicText").value = "";
}

function loadServerSetting() {
    const dataServer = serverSetting.get();
    if (dataServer) {
        document.getElementById("serverIPURL").value = dataServer;
        return true;
    }
    return false;
}
function loadTopicSetting() {
    const dataTopic = topicSetting.get();
    if (dataTopic) {
        document.getElementById("topicText").value = dataTopic;
        return true;
    }
    return false;
}

function turnButtons() {
    for (const button of document.getElementsByClassName("channel_button")) {
        button.removeAttribute("disabled");
        button.className += " btn-success";
    }
}

// Load Data
const divChannelList = document.querySelector(".list-group");
const inputChannelSearch = document.querySelector("#chanSearch");

inputChannelSearch.addEventListener("keyup", filterChannelList);

const channelList = [];

fetch("temp_data/tatasky.csv")
    .then((response) => response.text())
    .then((data) => Papa.parse(data).data)
    .then((entries) => {
        for (const data of entries.slice(1)) {
            const listItem = new ListItem(data);
            channelList.push(listItem);
            listItem.render(divChannelList);
        }
    });


function filterChannelList() {
    const filter = inputChannelSearch.value.toUpperCase();

    for (const item of channelList) {
        if (item.matchName(filter)) {
            item.show();
        } else {
            item.hide();
        }
    }
}

// document.addEventListener("keypress", setFocus);
// function setFocus(){
//     document.getElementById("chanSearch").focus();
// }

function isSearchBoxEmpty() {
    let searchBox = document.getElementById("chanSearch");
    if (searchBox.value.length > 0) {
        return false;
    } else {
        return true;
    }
}

function clearListHeader() {
    if (isSearchBoxEmpty()) {
        document.querySelector(".list-header").style.display = "flex";
    } else {
        document.querySelector(".list-header").style.display = "none";
    }
}

function emboldenCharacters(searchBoxText, itemText) { }

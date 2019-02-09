;(function(){
    var hotelsData = null;
    var sourceLocation = null;
    var destinationLocation = null;
    var targetId = null;
    var storageKey = 'hotelmanager';

    document.addEventListener('dragstart', function (e) {
    	console.log("drag Start");
        e.dataTransfer.setData("id", e.target.id);
        sourceLocation = e.target.parentElement.getAttribute("data-location");
        targetId = e.target.getAttribute("id");
    });

    document.addEventListener("dragover", function (e) {
    	console.log("dragover");
        e.preventDefault();
    });

    document.addEventListener("drop", function (e) {
    	console.log("drop")
        e.preventDefault();
        if (e.target.classList.contains("drop")) {
            var id = e.dataTransfer.getData("id");
            e.target.appendChild(document.getElementById(id));
            destinationLocation = e.target.getAttribute("data-location");
            updateLocationList();
        }
    });

    var saveBtn = document.getElementById('save');
    saveBtn.addEventListener("click", function (e) {
        var layoutMap = getLayoutMap();
        setDataToStorage(layoutMap);
        alert("Layout Saved");
    });

    var resetBtn = document.getElementById('reset');
    resetBtn.addEventListener("click", function (e) {
        var handleConfirm = confirm("Are you sure you want to Reset the layout?");
        if (!handleConfirm) return;
        if (window.localStorage !== undefined) {
            localStorage.removeItem(storageKey);
            window.location.reload();
            console.log("Storage Cleared");
        } else {
            console.error("No Local Storage Support");
            return;
        }
    });

    function handleLocations(res) {
        if (getDataFromStorage()) {
            setLayoutMap();
        } else {
            var locationsEl = document.getElementById("locations");
            var data = {
                "loactions": {
                    "1": "China",
                    "2": "USA",
                    "3": "England",
                    "4": "Germany",
                    "5": "Belgium"
                }
            };
            var locations = data.loactions;
            var html = "";
            for (key in locations) {
                var location = locations[key];
                html += '<div class="card indigo darken-3" draggable="true"><div class="card-content white-text"><span class="card-title">' + location + '</span></div><div class="drop" data-location="' + location + '"></div></div>';
            }
            locationsEl.innerHTML = html;
            createLocationUi(locations);
        }
    }

    function handleHotels(res) {
        var hotelsEl = document.getElementById("hotels");
        var data = {
            "hotels": {
                "1": "Mandarin Oriental",
                "2": "Trump International Hotel & Tower",
                "3": "Langham Hotel",
                "4": "Soho House Berlin",
                "5": "Hotel Amigo",
                "6": "Four Seasons Resort Hualalai",
                "7": "Wentworth Mansion",
                "8": "Four Seasons Gresham Palace",
                "9": "Hotel de Crillon",
                "10": "Le Sirenuse"
            }
        };
        var hotels = data.hotels;
        hotelsData = hotels;
        if (getDataFromStorage()) {
            setLayoutMap();
        } else {
            var html = "";
            for (key in hotels) {
                html += '<div class="card indigo darken-1" draggable="true" id="' + key + '"><div class="card-content white-text"><span class="card-title">' + hotels[key] + '</span></div></div>';
            }
            hotelsEl.innerHTML = html;
        }
    }

    function updateLocationList() {
        if (sourceLocation !== null) {
            var source = document.getElementById(sourceLocation);
            var target = source.getElementsByClassName(hotelsData[targetId])[0];
            target.remove();
        }

        if (destinationLocation !== null) {
            var element = document.getElementById(destinationLocation);
            var tr = document.createElement('tr');
            tr.setAttribute("class", hotelsData[targetId]);
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(hotelsData[targetId]));
            tr.appendChild(td);
            element.appendChild(tr);
        }
    }

    function createLocationUi(locations) {
        var html = "";
        var list = document.getElementById("location-list");
        for (var key in locations) {
            if (locations.hasOwnProperty(key)) {
                html += '<table><thead><tr><th>' + locations[key] + '</th></tr></thead><tbody id="' + locations[key] + '"></tbody></table>';
            }
        }
        list.innerHTML = html;
    }

    function setDataToStorage(val) {
        val = JSON.stringify(val);
        if (window.localStorage !== undefined) {
            localStorage.setItem(storageKey, val);
            console.log("Saved to storage");
        } else {
            console.error("No Local Storage Support");
            return;
        }
    }

    function getDataFromStorage() {
        if (window.localStorage !== undefined) {
            var data = localStorage.getItem(storageKey);
            return JSON.parse(data);
        } else {
            console.error("No Local Storage Support");
            return;
        }
    }

    function getLayoutMap() {
        var layoutMap = {};
        layoutMap.hotels = document.getElementById('hotels').innerHTML;
        layoutMap.locations = document.getElementById('locations').innerHTML;
        layoutMap.locationsList = document.getElementById('location-list').innerHTML;
        return layoutMap;
    }

    function setLayoutMap() {
        var data = getDataFromStorage();
        if (data) {
            document.getElementById('hotels').innerHTML = data.hotels;
            document.getElementById('locations').innerHTML = data.locations;
            document.getElementById('location-list').innerHTML = data.locationsList;
        }
    }

    handleLocations();
    handleHotels();
})();
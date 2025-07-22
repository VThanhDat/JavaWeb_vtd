var map = L.map("map").setView([10.805382011143632, 106.66613941915007], 18);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([10.805382011143632, 106.66613941915007]).addTo(map);

const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});


// console.log(coordinates);
// create a marker at a coordinate
const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(coordinates)   // listing.geomitry.corrdinates
    .addTo(map);

const popup = new mapboxgl.Popup()
    .setHTML(`<h4>${popupMsg}</h4><p>Exect location provide after booking</p>`);


marker.setPopup(popup);
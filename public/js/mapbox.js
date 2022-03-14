export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibS1vbGZhdGVlIiwiYSI6ImNremxod2FwOTA5dGIyeGxhdnY5eG81bmwifQ._pPNl4q2rWqz5dytRrgD8w';
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/m-olfatee/ckzlj95y0001z14ogetkrk7t8',
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 4,
        // interactive: false
    });

    const bounds = new mapboxgl.LngLatBounds()

    locations.forEach(loc => {
        // Create marker
        const el = document.createElement("div")
        el.className = "marker"
        // Add marker
        new mapboxgl.Marker({
            element: el,
            anchor: "bottom"
        })
            .setLngLat(loc.coordinates)
            .addTo(map)
        // Add popup
        new mapboxgl.Popup({
            offset: 25
        })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map)
        // Extends map bounds to include current location
        bounds.extend(loc.coordinates)
    });

    map.fitBounds(bounds, {
        padding: {
            top: 150,
            bottom: 150,
            left: 100,
            right: 100
        }
    })
}
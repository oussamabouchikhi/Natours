module const displayMap = locations => {
  mapboxgl.accessToken = 'pk.eyJ1Ijoib3Vzc2FtYWJvdWNoaWtoaSIsImEiOiJja2V2YjhrMm8weDNzMnVsaHlkdmJ1dnE5In0.eMLQJ_raug4lxNQlS8ezmQ';
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/oussamabouchikhi/ckevfgzwjamt919qqst030qxb',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(location => {
    // Create a div & append class marker to it
    const div = document.createElement('div');
    div.className = 'marker';

    // Add markers to the map
    new mapboxgl.Marker({
      element: div,
      anchor: 'bottom'
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add popup to the map
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>${location.day}: ${location.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extends(location.coordinates);
  });

  // Make markers fit our map
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      right: 100,
      bottom: 150,
      left: 100
    }
  });
};

import NgwMap from '@nextgis/ngw-leaflet';

NgwMap.create({
  target: 'map',
  baseUrl: 'https://demo.nextgis.com',
  zoom: 6,
}).then((ngwMap) => {
  const connector = ngwMap.connector;

  connector.getResource(5301).then((x) => {
    console.log(x);
  });

  ngwMap.addNgwLayer({
    id: 'building',
    resource: 5300,
    adapterOptions: {
      fit: true,
      unselectOnSecondClick: true,
      paint: { color: 'brown' },
      selectedPaint: { color: 'red' },
    },
  });
});

import NgwMap from '@nextgis/ngw-leaflet';
import 'leaflet.polylinemeasure';

NgwMap.create({
  target: 'map',
  center: [104, 52],
  zoom: 6,
  mapAdapterOptions: {
    //
  },
}).then((ngwMap) => {
  ngwMap.addLayer('OSM');
  const measureControl = new L.Control.PolylineMeasure();
  ngwMap.addControl(measureControl, 'top-right');
});

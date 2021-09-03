import NgwMap from '@nextgis/ngw-ol';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import Draw from 'ol/interaction/Draw';
import { Fill, Stroke, Style } from 'ol/style';

NgwMap.create({
  target: 'map',
  baseUrl: 'https://demo.nextgis.com/',
  // center: [104, 52],
  // zoom: 6,
  mapAdapterOptions: {
    //
  },
}).then(async (ngwMap) => {
  ngwMap.addBaseLayer('OSM');

  await ngwMap.addNgwLayer({
    resource: 4224, // 972

    fit: true,

    adapterOptions: {
      limit: 10,
      waitFullLoad: true,

      paint: {
        // stroke: false,

        fillOpacity: 0,
      },
    },
  });

  let map = ngwMap.mapAdapter.map;

  const source = new VectorSource();

  const vector = new VectorLayer({
    source: source,

    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: '#ffcc33',

        width: 2,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    }),
  });

  map.addLayer(vector);

  let draw = new Draw({
    source: source,
    type: 'LineString',
  });

  map.addInteraction(draw);

  // selectFromTileLayer(4253, ngwMap);
});


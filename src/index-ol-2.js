import 'ol/ol.css';

import VectorSource from 'ol/source/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import CircleStyle from 'ol/style/Circle';
import GeoJSON from 'ol/format/GeoJSON';
import Draw from 'ol/interaction/Draw';
import { Fill, Stroke, Style } from 'ol/style';
import { transformExtent, transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Map from 'ol/Map';

import NgwConnector from '@nextgis/ngw-connector';
import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';

const connector = new NgwConnector({
  baseUrl: 'https://demo.nextgis.com/',
});

const displayProjection = 'EPSG:3857';
const lonlatProjection = 'EPSG:4326';

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

fetchNgwLayerFeatures({
  connector,
  resourceId: 4224,
  limit: 10,
}).then((data) => {
  const geojson = {
    type: 'FeatureCollection',
    features: data,
  };
  const vectorSource = new VectorSource();
  const features = new GeoJSON().readFeatures(geojson, {
    dataProjection: lonlatProjection,
    featureProjection: displayProjection,
  });
  vectorSource.addFeatures(features);
  const layer = new VectorLayer({
    source: vectorSource,
    style: () => {
      const style = {
        stroke: new Stroke({
          color: 'yellow',
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.1)',
        }),
      };
      return new Style(style);
    },
  });
  map.addLayer(layer);
  const bounds = vectorSource.getExtent();
  map.getView().fit(bounds);

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
});

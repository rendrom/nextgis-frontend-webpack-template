import NgwMap from '@nextgis/ngw-ol';
import { DragBox, Select } from 'ol/interaction.js';
import { platformModifierKeyOnly } from 'ol/events/condition.js';
import { getBoundsCoordinates } from '@nextgis/utils';
import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';

NgwMap.create({
  target: 'map',
  baseUrl: 'https://demo.nextgis.com/',
  // center: [104, 52],
  // zoom: 6,
  mapAdapterOptions: {
    //
  },
}).then((ngwMap) => {
  ngwMap.addBaseLayer('OSM');
  selectFromTileLayer(4253, ngwMap);
});

function selectFromVectorLayer(resource, ngwMap) {
  const map = ngwMap.mapAdapter.map;
  ngwMap
    .addNgwLayer({
      resource,
      fit: true,
      adapterOptions: {
        paint: {
          color: 'white',
          stroke: true,
          weight: 3,
          strokeColor: 'blue',
          fillOpacity: 1,
          radius: 5,
        },
      },
    })
    .then((adapter) => {
      const layer = adapter.layer;
      const vectorSource = layer.getSource();
      const select = new Select();
      map.addInteraction(select);

      const selectedFeatures = select.getFeatures();

      const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
      });
      map.addInteraction(dragBox);

      dragBox.on('boxend', function () {
        // features that intersect the box are added to the collection of
        // selected features
        const extent = dragBox.getGeometry().getExtent();
        vectorSource.forEachFeatureIntersectingExtent(
          extent,
          function (feature) {
            selectedFeatures.push(feature);
          }
        );
      });

      // clear selection when drawing a new box and when clicking on the map
      dragBox.on('boxstart', function () {
        selectedFeatures.clear();
      });
    });
}

function selectFromTileLayer(resource, ngwMap) {
  const map = ngwMap.mapAdapter.map;
  ngwMap
    .addNgwLayer({ resource, fit: true, adapter: 'TILE' })
    .then((adapter) => {
      const layer = adapter.layer;
      const vectorSource = layer.getSource();
      const select = new Select();
      map.addInteraction(select);

      ngwMap.addGeoJsonLayer({
        id: 'highlight',
        paint: {
          color: 'white',
          stroke: true,
          weight: 3,
          strokeColor: 'blue',
          radius: 8,
        },
      });

      const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
      });
      map.addInteraction(dragBox);

      dragBox.on('boxend', function () {
        const e = dragBox.getGeometry().getExtent();
        const polygon = getBoundsCoordinates(e).map(([x, y]) => x + ' ' + y);
        const wkt = `POLYGON((${polygon.join(', ')}))`;
        fetchNgwLayerFeatures({
          resourceId: resource,
          connector: ngwMap.connector,
          intersects: wkt,
        }).then((features) => {
          ngwMap.setLayerData('highlight', {
            type: 'FeatureCollection',
            features,
          });
        });
      });

      // clear selection when drawing a new box and when clicking on the map
      dragBox.on('boxstart', function () {
        ngwMap.clearLayerData('highlight');
      });
    });
}

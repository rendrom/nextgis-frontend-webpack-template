import { DragBox, Select } from 'ol/interaction.js';
import { platformModifierKeyOnly } from 'ol/events/condition.js';
import GeoJSON from 'ol/format/GeoJSON';
import NgwMap from '@nextgis/ngw-ol';
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
  // selectFromVectorLayer(4253, ngwMap);
  selectFromTileLayer(4253, ngwMap);
});

function selectFromVectorLayer(resource, ngwMap) {
  const map = ngwMap.mapAdapter.map;
  ngwMap.addNgwLayer({ resource, fit: true }).then((adapter) => {
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
      vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
        selectedFeatures.push(feature);
      });
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

      ngwMap.addGeoJsonLayer({ id: 'highlight' });

      const dragBox = new DragBox({
        condition: platformModifierKeyOnly,
      });
      map.addInteraction(dragBox);

      dragBox.on('boxend', function () {
        const e = dragBox.getGeometry().getExtent();
        const polygon = [
          [e[0], e[1]],
          [e[0], e[3]],
          [e[2], e[3]],
          [e[2], e[1]],
          [e[0], e[1]],
        ].map(([x, y]) => x + ' ' + y);
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

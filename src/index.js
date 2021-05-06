import { DragBox, Select } from 'ol/interaction.js';
import { platformModifierKeyOnly } from 'ol/events/condition.js';
import NgwMap from '@nextgis/ngw-ol';

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
  const map = ngwMap.mapAdapter.map;
  ngwMap.addNgwLayer({ resource: 4253, fit: true }).then((adapter) => {
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
      var extent = dragBox.getGeometry().getExtent();
      console.log(extent);
      vectorSource.forEachFeatureIntersectingExtent(extent, function (feature) {
        selectedFeatures.push(feature);
      });
    });

    // clear selection when drawing a new box and when clicking on the map
    dragBox.on('boxstart', function () {
      selectedFeatures.clear();
    });
  });

  // ngwMap.addControl(measureControl, 'top-right');
});

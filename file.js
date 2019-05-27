const maxI = 200, rad = 21, opac = .6;
      var map, heatmap;

      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: {lat: 37.775, lng: -122.434},
          mapTypeId: 'roadmap'
        });

        fetch('static/location.json').then(function(response) {
          response.json().then(function(result) {
            let locations = result.locations.map((val) => {
              return new google.maps.LatLng(val.latitudeE7 * (10 ** -7), val.longitudeE7 * (10 ** -7));
            })

            heatmap = new google.maps.visualization.HeatmapLayer({
              data: locations,
              map: map,
              maxIntensity: maxI,
              radius: rad,
              opacity: opac
            });
          });
        });
      }

      // Function to change the radius of data points on heatmap
      function changeRadius(bool) {
        const step = 3, min = 0, max = 50;
        let current = heatmap.get('radius');
        let newValue = toggleUpDown(bool, current, step, min, max);

        heatmap.set('radius', newValue);
        document.getElementById("radiusNum").innerText = newValue;
      };

      // Function to change the opacity of the heatmap
      function changeOpacity(bool) {
        const step = .2, min = 0, max = 1;
        let current = heatmap.get('opacity');
        let newValue = toggleUpDown(bool, current, step, min, max);
        let rounded = round(newValue, 1);

        heatmap.set('opacity', rounded);
        document.getElementById("opacityNum").innerText = rounded;
      }

      // Function to change maxIntensity of the heatmap
      function changeIntensity(bool) {
        const step = 25, min = 0, max = 1000;
        let current = heatmap.get('maxIntensity');
        let newValue = toggleUpDown(bool, current, step, min, max);

        heatmap.set('maxIntensity', newValue);
        document.getElementById("intensityNum").innerText = newValue;
      };

      // Changes our toggle values and keeps them within our min/max values
      function toggleUpDown(bool, current, step, min, max){
        if (bool && current >= max) return current;
        if (!bool && current <= min) return current;

        if (bool) return current + step;
        return current - step;
      }

      // Used to round the opacity toggle to one decimal place
      function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
      }
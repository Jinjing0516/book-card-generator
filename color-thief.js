/*
* ColorThief - v2.2.5
* Get the dominant color from an image
* https://github.com/lokesh/color-thief/
* Copyright (c) 2008-2015 Lokesh Rathi
* MIT License
*/

(function() {
    'use strict';

    function createColorThief() {
        var ColorThief = function() {};

        /*
         * get the dominant color from an image
         */
        ColorThief.prototype.getColor = function(image) {
            var palette = this.getPalette(image, 5);
            return palette[0];
        };

        /*
         * get a color palette from an image
         */
        ColorThief.prototype.getPalette = function(image, colorCount) {
            colorCount = colorCount || 5;

            // Create canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);

            // Get image data
            var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pixels = imageData.data;

            // Build histogram
            var histogram = {};
            for (var i = 0; i < pixels.length; i += 4) {
                var r = pixels[i];
                var g = pixels[i + 1];
                var b = pixels[i + 2];

                // Reduce the number of colors to quantize
                var rq = Math.floor(r / 8);
                var gq = Math.floor(g / 8);
                var bq = Math.floor(b / 8);
                var key = rq + ',' + gq + ',' + bq;
                if (!histogram[key]) {
                    histogram[key] = {
                        r: r,
                        g: g,
                        b: b,
                        count: 0
                    };
                }
                histogram[key].count++;
            }

            // Convert to array
            var histogramArray = [];
            for (var k in histogram) {
                if (histogram.hasOwnProperty(k)) {
                    histogramArray.push(histogram[k]);
                }
            }

            // Sort by count descending
            histogramArray.sort(function(a, b) {
                return b.count - a.count;
            });

            // Take top N colors
            var topColors = histogramArray.slice(0, colorCount);
            return topColors.map(function(c) {
                return [c.r, c.g, c.b];
            });
        };

        return ColorThief;
    }

    // Export for browser
    if (typeof window !== 'undefined') {
        window.ColorThief = createColorThief();
    }

})();

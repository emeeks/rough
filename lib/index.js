import { RoughCanvas, RoughCanvasAsync } from './canvas.js';
import { RoughSVG, RoughSVGAsync } from './svg.js';
import { RoughGenerator, RoughGeneratorAsync } from './generator.js';

export default {
  canvas: function canvas(_canvas, config) {
    if (config && config.async) {
      return new RoughCanvasAsync(_canvas, config);
    }
    return new RoughCanvas(_canvas, config);
  },
  svg: function svg(_svg, config) {
    if (config && config.async) {
      return new RoughSVGAsync(_svg, config);
    }
    return new RoughSVG(_svg, config);
  },
  createRenderer: function createRenderer() {
    return RoughCanvas.createRenderer();
  },
  generator: function generator(config, size) {
    if (config && config.async) {
      return new RoughGeneratorAsync(config, size);
    }
    return new RoughGenerator(config, size);
  }
};
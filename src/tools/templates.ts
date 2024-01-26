import { templates } from '../globals/globals';
import { loopBackwards } from './arrays';

export function findTemplate(templateTitle: string): Layer | undefined {
  let template: Layer;

  const titleNoSpaces = templateTitle.replace(/\W+/g, '').toLowerCase();
  
  templates.forEach(t => {
    const nameNoSpaces = t.name.replace(/\W+/g, '').toLowerCase();
    if(nameNoSpaces === titleNoSpaces) template = t;
  });

  return template;
}

export function recursiveLayerLoop(layer: Layer, doThis: (layer: Layer) => unknown) {
  doThis(layer);
  if (layer.layers)
    loopBackwards(layer.layers, (nextLayer: Layer) =>
      recursiveLayerLoop(nextLayer, doThis)
    );
}

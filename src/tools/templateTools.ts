import { templates } from '../globals/globals';

function findTemplate(templateTitle: string): Layer | undefined {
  let template: Layer;

  const titleNoSpaces = templateTitle.replace(/\W+/g, '').toLowerCase();
  
  templates.forEach(t => {
    const nameNoSpaces = t.name.replace(/\W+/g, '').toLowerCase();
    if(nameNoSpaces === titleNoSpaces) template = t;
  });

  return template;
}

export { findTemplate };

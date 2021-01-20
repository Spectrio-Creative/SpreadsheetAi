import { loopBackwards } from "./tools";

function findTemplate(project_layers, template_title) {
  let template;
  function checkForTemplate(layer) {
    is_template = new RegExp(template_title, "i");
    if (is_template.test(layer.name)) {
      template = layer;
      return "stop";
    }
    if (/templates/i.test(layer.name)) {
      loopBackwards(layer.layers, checkForTemplate);
    }
  }

  loopBackwards(project_layers, checkForTemplate);

  return template;
}

export { findTemplate };

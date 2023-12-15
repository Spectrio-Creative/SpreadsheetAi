import { loopBackwards } from "./tools";

function findTemplate(project_layers, template_title) {
  let template;
  function checkForTemplate(layer) {
    const is_template = new RegExp(
      "^[\\s]*" + template_title.replace(" ", "[\\s]{0,1}") + "[\\s]*$",
      "i"
    );
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

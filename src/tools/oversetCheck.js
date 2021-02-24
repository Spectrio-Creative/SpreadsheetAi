function isOverset(textBox) {
  if (textBox.lines.length > 0) {
    if (
      textBox.lines[0].characters.length * textBox.lines.length <
      textBox.characters.length
    ) {
      return true;
    } else {
      return false;
    }
  } else if (textBox.characters.length > 0) {
    return true;
  }
}

function isOversetSingle(textBox) {
  if (textBox.lines.length > 0) {
    if (textBox.lines[0].characters.length < textBox.characters.length) {
      // this would work for one line
      return true;
    } else {
      return false;
    }
  } else if (textBox.characters.length > 0) {
    return true;
  }
}

export { isOverset, isOversetSingle };

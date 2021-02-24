import { application_path } from "./document";

function importImage(parent, url) {
  const file_urls = [
    new File(url),
    new File(application_path + "/" + url),
    new File(application_path + "/links/" + url),
    new File(application_path + "/images/" + url),
  ];
  let new_image = parent.placedItems.add();

  function tryToAttach(file, callback, onFail) {
    try {
      new_image.file = file;
      callback();
    } catch (e) {
      if (onFail) onFail(e);
    }
  }

  let image_attached = false;
  file_urls.forEach((v, i) => {
    tryToAttach(v, () => {
      image_attached = true;
    });
    if (image_attached) return;
  });

  if (!image_attached) {
    alert(`"${file_urls[0].name}" not found.`);
    new_image.remove();
    return;
  }

  return new_image;
}

export { importImage };

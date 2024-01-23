export function recursiveAlert(clarification: string = "") {
  alert(`Recursive references not allowed!\n${clarification}This would cause an infinite loop and so has been ignored.`);
}

export function deMoustache(
  original: string,
  lookup: { [key: string]: string },
  bannedKeys: string[] = []
): string {
  if (!original) return;
  if (!lookup) return;
  const hasMoustaches = /{{[\s]*(\w+)[\s]*}}/gi;
  if (!hasMoustaches.test(original)) return original;

  let moustacheless = original;
  bannedKeys = bannedKeys || [];
  if (!Array.isArray(bannedKeys))
    alert("Banned Keys must be presented as an Array");

  for (const key in lookup) {
    const moustache = new RegExp(
      "{{[\\s]*" + key.replace(" ", "[\\s]{0,1}") + "[\\s]*}}",
      "i"
    );
    if (moustache.test(moustacheless)) {
      if (moustache.test(lookup[key])) {
        recursiveAlert(`The key, ${key}, was referenced in its own value. `);
        continue;
      }

      if (bannedKeys.indexOf(key) !== -1) {
        recursiveAlert(`The key, ${key}, was referenced in a previous value.`);
        continue;
      }

      const replacementText = hasMoustaches.test(lookup[key])
        ? deMoustache(lookup[key], lookup, [...bannedKeys, key])
        : lookup[key];

      moustacheless = moustacheless.replace(moustache, replacementText);
    }
  }

  return moustacheless;
}

export function camelCase(str: string) {
  const words = str.match(/([a-z]+|[A-Z]\w+)/g);
  if (!words) return str;
  words[0] = words[0].toLowerCase();
  let camelString = "";
  words.forEach((word, index) => {
    if (index === 0) {
      camelString += word;
      return;
    }
    camelString += word[0].toUpperCase() + word.substring(1);
  });

  return camelString;
}
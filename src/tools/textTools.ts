function deMoustache(original: string, lookup: {[key: string]: string}, bannedKeys: string[] = []) {
  if (!lookup) return;
  const hasMoustaches = /{{[\s]*(\w+)[\s]*}}/gi;
  if (!hasMoustaches.test(original)) return original;

  let moustacheless = original;
  bannedKeys = bannedKeys || [];
  if(!Array.isArray(bannedKeys)) alert("Banned Keys must be presented as an Array");

  for (const key in lookup) {
    const moustache = new RegExp(
      "{{[\\s]*" + key.replace(" ", "[\\s]{0,1}") + "[\\s]*}}",
      "i"
    );
    if (moustache.test(moustacheless)) {
      if (moustache.test(lookup[key])) {
        alert(`Recursive references not allowed!
          The key, ${key}, was referenced in its own value. This would cause an infinite loop and so has been ignored.`);
        continue;
      }

      if (bannedKeys.indexOf(key) !== -1) {
        alert(`Recursive references not allowed!
        '${key}' includes a reference to a value that also references '${key}'. This would cause an infinite loop and so has been ignored.`);
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

export { deMoustache };

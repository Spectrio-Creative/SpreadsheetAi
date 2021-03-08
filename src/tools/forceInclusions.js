// several opperations elsewhere include methods
// without defining them (for instance, the spread opperator
// uses Array.isArray() as _arrayIsArray but does not define it)
// thus causing an error. If we use these functions directly
// it forces the transpiler to define them, which then fixes
// the root issue.

function forceInclusions() {
  // class Y extends X requires both
  // Object.create and Object.defineProperties
  const boogle = { fish: "fingers" };
  const doubleBoo = Object.create(boogle);
  console.log(doubleBoo.fish);

  const object1 = {};
  Object.defineProperties(object1, {
    property1: {
      value: 42,
      writable: true,
    },
    property2: {},
  });
  console.log(object1.property1);
}

export { forceInclusions };

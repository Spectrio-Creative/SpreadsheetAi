import strip from "strip-comments";

// rollup-plugin-my-example.js
export default function stripComments() {
  return {
    name: "remove-comments", // this name will show up in logs and errors
    transform(code, _id) {

      return {
        code: strip(code),
        map: null,
      };
    },
  };
}

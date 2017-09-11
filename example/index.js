exports.add = function add(a, b) {
  return a + b;
};

exports.useDOMApi = function useDOMApi() {
  const range = document.createRange();
  range.setStart(document.body, 0);
  range.setEnd(document.body, 0);
};

exports.printMe = function printMe(arg) {
  console.info(arg);
  return arg;
};

import { formatMessage, calculateSum, JS_CONSTANT, MessageFormatter } from "./utils.js";
const JS_IMPORT_LABEL = "JavaScript Import Test";
function JsImportTest() {
  let greeting = formatMessage("Jac");
  let sum = calculateSum(5, 3);
  let formatter = MessageFormatter("JS");
  let formatted = formatter.format("Hello from JS class");
  return __jacJsx("div", {"class": "js-import-test"}, [__jacJsx("h1", {}, [JS_IMPORT_LABEL]), __jacJsx("p", {}, ["Greeting: ", greeting]), __jacJsx("p", {}, ["Sum (5 + 3): ", sum]), __jacJsx("p", {}, ["Constant: ", JS_CONSTANT]), __jacJsx("p", {}, ["Formatted: ", formatted])]);
}
function Main() {
  return __jacJsx(JsImportTest, {}, []);
}

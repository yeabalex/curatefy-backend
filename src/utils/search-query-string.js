function sqsFomater(str) {
  let formatedStr = "";
  const strArr = str.split(" ");
  strArr.map((s) => (formatedStr = formatedStr + s + "+"));
  formatedStr.split(" ").splice(0, -1).join("");

  return formatedStr;
}

module.exports = sqsFomater;

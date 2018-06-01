module.exports = function([sails, text]){
  console.log("second task");
  console.log(text)
  throw new Error("i don't wanna lift");
};

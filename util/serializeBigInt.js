export default BigInt.prototype["toJSON"] = function () {
  return this.toString();
};
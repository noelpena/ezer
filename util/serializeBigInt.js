export default function SerialBigInt(){ 
  BigInt.prototype["toJSON"] = function () {
    return this.toString();
  };
}
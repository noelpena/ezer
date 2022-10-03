import { prisma } from '../../../util/prismaClient.js'

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

export default async function handler(req, res) {
  if(req.method !== 'GET'){
    return res.status(405).json({message:'Method not allowed'})
  }

  const allDeposits = await prisma.deposit.findMany();

  res.status(200).json({
    message: "Deposits found",
    data: allDeposits
  });
}
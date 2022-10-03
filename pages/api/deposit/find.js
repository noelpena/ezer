import { prisma } from '../../../util/prismaClient.js'

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

export default async function handler(req, res) {
  if(req.method !== 'GET'){
    return res.status(405).json({message:'Method not allowed'})
  }

  if(req.query.deposit === undefined){
    return res.status(400).json({
      message: 'Something went wrong. Deposit ID not found. Did you mean to find many?',
    })    
  }

  const deposit = await prisma.deposit.findUnique({
    where: {
      id: req.query.deposit
    }
  });

  res.status(200).json({
    message: "Deposit found",
    data: deposit
  });
}
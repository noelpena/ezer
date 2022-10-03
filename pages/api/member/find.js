import { prisma } from '../../../util/prismaClient.js'

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

export default async function handler(req, res) {
  if(req.method !== 'GET'){
    return res.status(405).json({message:'Method not allowed'})
  }

  if(req.query.member === undefined){
    return res.status(400).json({
      message: 'Something went wrong. Member ID not found. Did you mean to find many?',
    })    
  }

  const member = await prisma.member.findUnique({
    where: {
      id: req.query.member
    }
  });

  res.status(200).json({
    message: "Member found",
    data: member
  });
}
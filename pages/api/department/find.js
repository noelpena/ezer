import { prisma } from '../../../util/prismaClient.js'

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

export default async function handler(req, res) {
  if(req.method !== 'GET'){
    return res.status(405).json({message:'Method not allowed'})
  }

  if(req.query.department === undefined){
    return res.status(400).json({
      message: 'Something went wrong. Department ID not found. Did you mean to find many?',
    })    
  }

  const department = await prisma.department.findUnique({
    where: {
      id: req.query.department
    }
  });

  res.status(200).json({
    message: "Department found",
    data: department
  });
}
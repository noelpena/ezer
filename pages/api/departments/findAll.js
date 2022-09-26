import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

BigInt.prototype["toJSON"] = function () {
  return this.toString();
};

export default async function handler(req, res) {
  if(req.method !== 'GET'){
    return res.status(405).json({message:'Method not allowed'})
  }

  const allDepartments = await prisma.department.findMany();

  res.status(200).json({
    message: "Departments found",
    data: allDepartments
  });
}
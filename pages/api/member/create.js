import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../../util/prismaClient.js'

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction


export default async function handler(req, res) {
  if(req.method !== 'POST'){
    return res.status(405).json({message:'Method not allowed'})
  } else{
    // OTHER HTTP METHODS
  }

  // try {
    const body = JSON.parse(req.body);
    const {full_name} = body
    const newMember = await prisma.member.create({
      data: {
        full_name: full_name,
        is_active: true,
        id: uuidv4()
      },
      select: {
        id: true,
        created_at:false,
        last_modified: false,
        full_name: true,
        average_tithe: false,
        highest_tithe: false,
        lowest_tithe: false,
        total_tithe: false,
        total_yearly_tithe: false,
        is_active: true,
        records:false
      }
    });

//    const newMember = await prisma.member.findFirst();
    console.log(newMember)
    res.status(200).json({
      message: "Record added",
      data: newMember
    })
  //} catch (error) {
    // res.status(400).json({
    //   message: 'Something went wrong',
    //   data: error
    // })    
 // }

}
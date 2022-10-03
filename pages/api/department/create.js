import { prisma } from '../../../util/prismaClient.js'

export default async function handler(req, res) {
	if(req.method !== 'POST'){
		return res.status(405).json({message:'Method not allowed'})
	} 

	const body = JSON.parse(req.body);
	const {name} = body
	const newDept = await prisma.department.create({
		data: {
			name: name,
			is_active: true,
		},
		select: {
			id: false,
			name: true,
			is_active: true,
			created_at:false,
			last_modified: false,        
			account_type: false,
			balance:false,
			records:false
		}
	});

	res.status(200).json({
		message: "Record added",
		data: newDept
	})

}
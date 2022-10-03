import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../../util/prismaClient.js'

export default async function handler(req, res) {
	if(req.method !== 'POST'){
		return res.status(405).json({message:'Method not allowed'})
	} 

	const body = JSON.parse(req.body);

	const { date, amount, notes, depositType } = body;
	let convertedAmount = parseFloat(amount) * 100;

	const newDeposit = await prisma.deposit.create({
		data: {
			id: uuidv4(),
			deposit_date: new Date(date),
			amount: convertedAmount,
			notes,
			deposit_type: depositType
		},
		select: {
			id: true,
			created_at: false,
			last_modified: false,
			deposit_type: true,
			notes: true,
			amount: true,
			deposit_date:true,
		}
	});

	res.status(200).json({
		message: "Deposit record added",
		data: newDeposit
	})

}
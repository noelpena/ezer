
import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { Container } from '@mantine/core';
import DepartmentList from './DepartmentList';
import { SimpleGrid, Button } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';
import SerialBigInt from '../../util/serializeBigInt.js'
SerialBigInt();

export default function Departments({data}) {
  return (
    <Container>
        <Head>
            <title>View Departments</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <SimpleGrid cols={2} spacing="lg" style={{alignItems: "center"}}>
            <h2>View Departments</h2>

            <Button.Group className='justify-self-end'>
                <Button 
                    variant="gradient"
                    gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
                    Add New
                </Button>
                <Button
                    color='blue'>
                    <IconChevronDown size={18} />
                </Button>
            </Button.Group>

        </SimpleGrid>
        <DepartmentList data={data} />
    </Container>
  )
}


export async function getServerSideProps() {
    const prisma = new PrismaClient()
    const allDepartments = await prisma.department.findMany();

    return { 
        props: { 
            data: JSON.parse(JSON.stringify(allDepartments))
        }
    }
}
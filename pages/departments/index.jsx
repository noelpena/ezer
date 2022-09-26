
import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import { Container } from '@mantine/core';
import DepartmentList from './DepartmentList';
import { SimpleGrid, Button } from '@mantine/core';

export default function Departments({data}) {
  return (
    <Container>
        <Head>
            <title>View Departments</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <SimpleGrid cols={3} spacing="lg">
            <h2>View Departments</h2>
            <Button 
                h={50}
                variant="gradient"
                gradient={{ from: 'teal', to: 'blue', deg: 60 }}>
                Add New
            </Button>
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
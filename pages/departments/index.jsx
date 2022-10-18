
import Head from 'next/head'
import { useState } from 'react';
import { PrismaClient } from '@prisma/client'
import DepartmentList from './DepartmentList';
import { Container, SimpleGrid, Button } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';
import SerialBigInt from '../../util/serializeBigInt.js'
import DeptModal from '../../components/DeptModal';
SerialBigInt();

export default function Departments({data}) {    
    const [opened, setOpened] = useState(false);

    const toggleModal = function(tf) {
        setOpened(tf);
    };

    return (    
        <>
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
                            gradient={{ from: 'teal', to: 'blue', deg: 60 }}
                            onClick={() => setOpened(true)}
                            >
                            Add New
                        </Button>
                        <Button className='px-1' color='blue'>
                            <IconChevronDown size={18} />
                        </Button>
                    </Button.Group>

                </SimpleGrid>
                <DepartmentList data={data} />
            </Container>
            
            <DeptModal isModalOpen={opened} toggle={toggleModal} />
        </>
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
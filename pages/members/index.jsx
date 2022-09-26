
import Head from 'next/head'
import { PrismaClient } from '@prisma/client'
import MemberList from './MemberList'
import { Container } from '@mantine/core';

export default function Members({data}) {
  return (
    <Container>
        <Head>
            <title>View Members</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <h2>View Members</h2>
        <MemberList data={data} />
    </Container>
  )
}


export async function getServerSideProps() {
    const prisma = new PrismaClient()
    const allMembers = await prisma.member.findMany();

    // Pass data to the page via props
    return { 
        props: { 
            data: JSON.parse(JSON.stringify(allMembers))
        }
    }
}

import Head from 'next/head'
import { useState } from 'react';
import { PrismaClient } from '@prisma/client'
import DepartmentList from './DepartmentList';
import { Container, SimpleGrid, Button, Modal } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons';
import SerialBigInt from '../../util/serializeBigInt.js'
SerialBigInt();

export default function Departments({data}) {
    const [opened, setOpened] = useState(false);

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
                            onClick={() => setOpened(true)}>
                            Add New
                        </Button>
                        <Button className='px-1' color='blue'>
                            <IconChevronDown size={18} />
                        </Button>
                    </Button.Group>

                </SimpleGrid>
                <DepartmentList data={data} />
            </Container>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Add New Department"
            >
                <form id="form-new-department" onSubmit={depositForm.onSubmit((values) => submitDeposit(values))}>

                    <DatePicker
                    label="Deposit Date:"
                    placeholder="Deposit date"
                    firstDayOfWeek="sunday"
                    withAsterisk
                    {...depositForm.getInputProps('date')}
                    />

                    <NumberInput
                    mt="sm"
                    label="Amount"
                    placeholder="0.00"
                    step={.01}
                    precision={2}
                    hideControls
                    withAsterisk
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    formatter={(value) =>
                        !Number.isNaN(parseFloat(value))
                        ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        : '$ '
                    }
                    {...depositForm.getInputProps('amount')}
                    />

                    <Textarea
                    className='mt-2'
                    placeholder="Notes"
                    label="Notes"
                    autosize
                    minRows={2}
                    {...depositForm.getInputProps('notes')}
                    />

                    <NativeSelect
                    className='mt-2'
                    // data={['Bank', 'Venmo']}
                    data={[{ value: 'bank', label: 'Bank' }, { value: 'venmo', label: 'Venmo' }]}
                    value='Bank'
                    placeholder="Pick one"
                    label="Select kind of deposit"
                    withAsterisk
                    {...depositForm.getInputProps('depositType')}
                    />

                    <Button type="submit" mt="sm">
                    Submit
                    </Button>
                </form>
            </Modal>
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
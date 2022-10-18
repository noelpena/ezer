
import { z } from 'zod';
import { useState } from 'react';
import { useForm, zodResolver  } from '@mantine/form';
import { Button, Modal, TextInput } from '@mantine/core';

export default function DeptModal({isModalOpen, toggle}){

    const departmentSchema = z.object({
        name: z.string().min(1),
    });

    const departmentForm = useForm({
        validate: zodResolver(departmentSchema),
            initialValues: { 
                name: ''
            },
    });

    const submitDepartment = async (values) => {
    const res = await fetch(`api/department/create`,{
        method: 'POST',
        body: JSON.stringify(values) 
    });
    const data = await res.json();
    } 

    return(    
        <Modal
            opened={isModalOpen}
            onClose={() => toggle(false)}
            title="Add New Department"
        >
            <form 
                id="form-new-department" 
                onSubmit={
                    departmentForm.onSubmit((values) => submitDepartment(values))
                }>
                <TextInput 
                    label="Department Name"
                    description="Enter Department name below" 
                    mt="sm"
                    placeholder="Misiones"
                    withAsterisk
                    
                    {...departmentForm.getInputProps('name')}
                />

                <Button type="submit" mt="sm">
                    Submit
                </Button>
            </form>
        </Modal>

    );
}
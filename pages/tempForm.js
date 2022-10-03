import {useState} from 'react'
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { NumberInput, TextInput, Button } from '@mantine/core';

export default function tempForm() {

  // MEMBER
  const [fullName, setFullName] = useState('');

  const submitMember = async (e) => {
    e.preventDefault();

    const res = await fetch(`api/member/create`,{
      method: 'POST',
      body: JSON.stringify({full_name: fullName}) 
    });
    const data = await res.json();
  } 
  const handleFullNameChange = e => {
    if(e.target.value !== ''){
      setFullName(e.target.value);
    }
  };

  // DEPARTMENT
  const [deptName, setDeptName] = useState('');

  const submitDeptName = async (e) => {
    e.preventDefault();

    const res = await fetch(`api/department/create`,{
      method: 'POST',
      body: JSON.stringify({
        name: deptName
      }) 
    });
    const data = await res.json();
  } 
  const handleDeptNameChange = e => {
    if(e.target.value !== ''){
      setDeptName(e.target.value);
    }
  };

  // DEPOSIT
  const form = useForm({
    initialValues: { date: '', name: '', amount: '', depositType: 'bank' },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      date: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      amount: (value) => (value < 18 ? 'You must be at least 18 to register' : null),
    },
  });

  const [depositData, setDepositData] = useState({
    date: '',
    amount: 0,
    notes: '',
    depositType: 'bank'
  });

  // validation
  // amount can't be zero 
  // amount has to be in cents

  const submitDeposit = async (e) => {
    e.preventDefault();

    const res = await fetch(`api/deposit/create`,{
      method: 'POST',
      body: JSON.stringify(depositData) 
    });
    const data = await res.json();
  } 
  const handleDepositChange = e => {
    const key = e.target.name;
    if(e.target.value !== ''){
      setDepositData((prevState) => {
        return {
          ...prevState,
          [key]: e.target.value
        };
      });
    }
  };

  return (
    <>
      <h2>Add new member</h2>
      <form action="" id="form-new-member" onSubmit={(e) => submitMember(e)}>
        <label htmlFor="input-name">Full Name</label>
        <input 
          type="text"
          placeholder="Full Name"
          id="input-name" 
          onChange={(e) => handleFullNameChange(e)}
        />

        <input type="submit" placeholder="Submit" />
      </form>   

      <h2>Add Department</h2> 
      <form action="" id="form-new-department" onSubmit={(e) => submitDeptName(e)}>
        <label htmlFor="input-department">Department Name</label>
        <input 
          type="text"
          placeholder="Department Name" 
          id="input-department" 
          onChange={(e) => handleDeptNameChange(e)}
        />

        <input type="submit" placeholder="Submit" />
      </form>

      <h2>Add Category</h2> 
      <form action="" id="form-new-category">
        <label htmlFor="input-category">Category Name</label>
        <input type="text" placeholder="Category Name" id="input-category" />
      </form>  

      <h2>Add a Record</h2> 
      <form action="" id="form-new-record">

        {/* SHOULD BE A DROPDOWN  */}
        <label htmlFor="new-record-category">Category Name</label>
        <input name="category" type="text" placeholder="Category Name" id="new-record-category" />

        {/* SHOULD BE A DROPDOWN  */}
        <label htmlFor="new-record-member">Member Name</label>
        <input name="member" type="text" placeholder="Member Name" id="new-record-member" />

        {/* SHOULD BE A DROPDOWN  */}
        <label htmlFor="new-record-department">Department Name</label>
        <input name="department" type="text" placeholder="Department Name" id="new-record-department" />

        <label htmlFor="new-record-amount">Amount</label>
        <input name="amount" type="number" placeholder="12.00" id="new-record-amount" />

        <label htmlFor="new-record-income-expense">Income or Expense?</label>
        <select name="income-expense" id="new-record-income-expense">
          <option value="" disabled defaultValue={''}>Income or Expense?</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <label htmlFor="new-record-payment-type">Cash or Check?</label>
        <select name="payment-type" id="new-record-payment-type">
          <option value="" disabled defaultValue={""}>Cash or Check?</option>
          <option value="cash">Cash</option>
          <option value="check">Check</option>
          <option value="debit-card">Debit Card</option>
          <option value="venmo">Venmo</option>
        </select>

        <label htmlFor="new-record-notes">Description/notes</label>
        <textarea name="notes" id="new-record-notes"  rows="4" cols="50">
        </textarea>

        <label htmlFor="new-record-date">Date:</label>
        <input name="date" type="date" id="new-record-date" />

        <input type="hidden" id="new-record-status" name="status" value="recorded" />

        {/* 
        
        HAVE A LIST OF DEPOSITS HERE AND CAN SELECT FROM A LIST OF ACTIVE/AVAILABLE DEPOSITS

        ADD THE RECORD TO A DEPOSIT WHILE RECORDING THE RECORD

        STATUS WILL DEFAULT TO RECORDED
        
        */}

      </form> 


      <h2>Add a New Deposit</h2> 
      {/* <form action="" id="form-new-deposit" onSubmit={(e) => submitDeposit(e)}> */}
      <form action="" id="form-new-deposit" onSubmit={form.onSubmit(console.log)}>

        <DatePicker
          label="Deposit Date:"
          placeholder="Pick date"
          firstDayOfWeek="sunday"
        />

        <TextInput label="Name" placeholder="Name" {...form.getInputProps('name')} />
        <TextInput mt="sm" label="Email" placeholder="Email" {...form.getInputProps('email')} />
        <NumberInput
          mt="sm"
          label="Age"
          placeholder="Age"
          min={0}
          max={99}
          {...form.getInputProps('age')}
        />
        <Button type="submit" mt="sm">
          Submit
        </Button>
{/* 
        <label htmlFor="new-deposit-date">Deposit Date:</label>
        <input name="date" type="date" id="new-deposit-date" onChange={(e) => handleDepositChange(e)} />

        <label htmlFor="new-deposit-amount">Amount</label>
        <input name="amount" type="number" step='0.01' placeholder='0.00' id="new-deposit-amount" onChange={(e) => handleDepositChange(e)} />

        <label htmlFor="new-deposit-notes">Notes</label>
        <textarea name="notes" id="new-deposit-notes"  rows="4" cols="50" onChange={(e) => handleDepositChange(e)}>
        </textarea>

        <label htmlFor="new-deposit-type">Deposit Type?</label>
        <select name="depositType" id="new-deposit-type" onChange={(e) => handleDepositChange(e)}>
          <option value="" disabled defaultValue={""}>Deposit Type</option>
          <option value="bank">Bank</option>
          <option value="venmo">Venmo</option>
        </select>      

        <input type="submit" placeholder="Submit" /> */}
      </form> 


      <h2>Add a New Balance</h2> 
      <form action="" id="form-new-balance">

        {/* SHOULD BE A DROPDOWN  */}
        <label htmlFor="new-balance-department">Department Name</label>
        <input name="department" type="text" placeholder="Department Name" id="new-balance-department" />

        <label htmlFor="new-balance-amount">Balance Amount</label>
        <input name="amount" type="number" placeholder="300.00" id="new-balance-amount" />

        <label htmlFor="new-balance-current-year">Current Year</label>
        <input name="current-year" type="number" placeholder="2021" id="new-balance-current-year" />


        <label htmlFor="new-balance-previous-amount">Previous Balance Amount</label>
        <input name="amount" type="number" placeholder="300.00" id="new-balance-previous-amount" />

        <label htmlFor="new-balance-previous-year">Previous Year</label>
        <input name="previous-year" type="number" placeholder="2021" id="new-balance-previous-year" />     
      </form> 
    </>

  )
}

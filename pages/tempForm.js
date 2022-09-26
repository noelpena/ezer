import {useState} from 'react'

export default function tempForm() {

  const [fullName, setFullName] = useState('');

  const submitMember = async (e) => {
    e.preventDefault();

    const res = await fetch(`api/members/create`,{
      method: 'POST',
      body: JSON.stringify({full_name: fullName}) 
    });
    const data = await res.json();

    console.log(data);
  } 

  const handleFullNameChange = e => {
    if(e.target.value !== ''){
      setFullName(e.target.value);
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
      <form action="" id="form-new-department">
        <label htmlFor="input-department">Department Name</label>
        <input type="text" placeholder="Department Name" id="input-department" />
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
      <form action="" id="form-new-deposit">

        <label htmlFor="new-deposit-date">Deposit Date:</label>
        <input name="date" type="date" id="new-deposit-date" />

        <label htmlFor="new-deposit-amount">Amount</label>
        <input name="amount" type="number" placeholder="1500.00" id="new-deposit-amount" />

        <label htmlFor="new-deposit-notes">Notes</label>
        <textarea name="notes" id="new-deposit-notes"  rows="4" cols="50">
        </textarea>

        <label htmlFor="new-deposit-type">Deposit Type?</label>
        <select name="deposit-type" id="new-deposit-type">
          <option value="" disabled defaultValue={""}>Deposit Type</option>
          <option value="bank">Bank</option>
          <option value="venmo">Venmo</option>
        </select>        
      </form> 

          {/* SHOULD BE A DROPDOWN  */}

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

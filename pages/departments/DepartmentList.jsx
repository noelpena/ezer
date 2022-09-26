import { Table } from '@mantine/core';

export default function DepartmentList({data}) {
    const rows = data.map((dept) => (
        <tr key={dept.id}>
          <td>{dept.name}</td>
          <td>{isNaN(dept.balance) ? "$0.00" : `$${dept.balance.toFixed(2)}`}</td>
          <td>{isNaN(dept.active) ? "No" : dept.active === 1 ? "Yes" : "No"}</td>
        </tr>
    ));

    return (
    <Table verticalSpacing="sm" fontSize="lg" highlightOnHover>
        <thead>
        <tr>
            <th>Department name</th>
            <th>Balance</th>
            <th>Active</th>
        </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </Table>
    )
}

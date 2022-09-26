import { Table, List } from '@mantine/core';

export default function MemberList({data}) {
    const rows = data.map((member) => (
        <tr key={member.id}>
          <td>{member.full_name}</td>
        </tr>
    ));

    return (
    <Table verticalSpacing="sm" fontSize="lg" highlightOnHover>
        <thead>
        <tr>
            <th>Member name</th>
        </tr>
        </thead>
        <tbody>
            {rows}
        </tbody>
    </Table>
    )
}

import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, {useState} from 'react';
import UserAddModal from './UserAddModal';

const User = () => {
    const [open, setopen] = useState(false);
    const handleOpen = () => {
         setopen(!open)
    }
    return (
        <>        
          <UserAddModal status={open}/>
          <div style={{marginTop: '80px'}}>
             <Button variant="contained" size="small" className="float-right mr-3" onClick={handleOpen}>Create User</Button>
             <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Sr.</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Password</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    <TableRow>
                            <TableCell>Sr.</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>User Name</TableCell>
                            <TableCell>Password</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
             </TableContainer>
          </div>
           
        </>
    );
}

export default User;

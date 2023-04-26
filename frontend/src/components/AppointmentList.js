import * as React from 'react';
import { useEffect, useState } from "react";
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


const AppointmentList = ({ appointments }) => {
    useEffect(() => {
    }, [appointments]);

    return (
        <div>
        
            <Stack spacing={2} >

                {appointments.map(appointment => (
                    <div>
                        <Button variant="outlined">{new Date (appointment.start_time).toTimeString().substring(0,5) + " GMT-" + new Date (appointment.end_time).toTimeString().substring(0,5)+ " GMT"}</Button>

                    </div>
                )) }
            </Stack>
        </div>
    

   
    )
  

}
export default AppointmentList;
import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';

type accountStatisticsProps = {
    userId: number,
    username: string,
    profDesc: string,

}

export default function Profile(props) {
    return <>
    <div style={{textAlign: 'center'}}>
        <h1>Welcome to {props.username}'s Profile!</h1><br></br>
        {props.profDesc}
    </div>
    </>
}
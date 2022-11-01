import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';

type accountStatisticsProps = {
    userId: number,

}

export default function Profile(props) {
    return <>This is {props.userId}'s Profile</>
}
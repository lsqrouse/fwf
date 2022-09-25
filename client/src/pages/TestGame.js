import { AgGridReact } from 'ag-grid-react';
import React, { useState } from 'react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

export default function TestGame(props) {
    const colDefs = [
        {field: 'id'}
    ]
    
    console.log('Props of testGmae')
    console.log(props)
    return (
        <>
        <h1>hello world, game is this {props.lobbyId}, players are currently</h1>
        <div className='ag-theme-alpine'>
           <AgGridReact
               rowData={props.playerList}
               columnDefs={colDefs}>
           </AgGridReact>
       </div>        </>
    );
}
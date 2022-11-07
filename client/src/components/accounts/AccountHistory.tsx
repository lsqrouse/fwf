import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';

type accountStatisticsProps = {
    username: string,

}

export default function AccountHistory(props: accountStatisticsProps) {
    const [statData, setStatData] = useState<any>(null);

    const colDefs = [
        {field: 'game_name'},
        {field: 'winners'},
        {field: 'losers'}
    ]

    const getData = () => {
        fetch(`/api/accounts/history?userId=${props.username}`)
        .then((res) => res.json())
        .then((data) => {
            setStatData(data);
        })
    }
    if (statData == null) {
        setTimeout(getData, 500)
        
    }

    return (<>
    <div style={{textAlign: 'center'}}>
    <h3> {props.username}'s game history</h3>
    <div className="ag-theme-alpine" style={{height: 400, width: 600, textShadow:'none', color: 'black', marginTop:'5%'}}>
           <AgGridReact
               rowData={statData}
               columnDefs={colDefs}>
           </AgGridReact>
       </div>
    </div>
    </>)
}
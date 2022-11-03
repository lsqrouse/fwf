import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';

type accountStatisticsProps = {
    userId: number,
    username: string,

}

export default function AccountHistory(props: accountStatisticsProps) {
    const [statData, setStatData] = useState<any>(null);

    const colDefs = [
        {field: 'game_name'},
        {field: 'winners'},
        {field: 'losers'}
    ]
    if (statData == null && props.userId >= 0) {
        fetch(`/api/accounts/history?userId=${props.userId}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(`got data from api for user history: with ${props.userId}`, data)
            setStatData(data);
        })
    }
    if (statData == null && props.userId == -2){
        setStatData([])
    }
    return (<>
    <div style={{textAlign: 'center'}}>
    <h3> {props.username}'s game history</h3>
    <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           <AgGridReact
               rowData={statData}
               columnDefs={colDefs}>
           </AgGridReact>
       </div>
    </div>
    </>)
}
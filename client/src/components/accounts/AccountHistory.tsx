import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';

type accountStatisticsProps = {
    userId: number,

}

export default function AccountHistory(props: accountStatisticsProps) {
    const [statData, setStatData] = useState(null);

    const colDefs = [
        {field: 'game_name'},
        {field: 'winners'},
        {field: 'losers'}
    ]
    if (statData == null) {
        fetch(`/api/accounts/history?userId=${props.userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("got data from api: ", data)
          setStatData(data);
        })
    }
    return (<>
    <h1> These are the history, {props.userId}</h1>
    <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           <AgGridReact
               rowData={statData}
               columnDefs={colDefs}>
           </AgGridReact>
       </div>
    </>)
}
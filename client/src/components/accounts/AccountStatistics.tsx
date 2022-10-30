import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';

type accountStatisticsProps = {
    userId: string,

}

export default function AccountStatistics(props: accountStatisticsProps) {
    const [statData, setStatData] = useState([]);

    const colDefs = [
        {field: 'gameName'},
        {field: 'wins'},
        {field: 'losses'}
    ]
    if (statData.length == 0) {
        fetch(`/api/accounts/stats?userId=${props.userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("got data from api: ", data.games)
          setStatData(data.games);
        })
    }

    return (<>
    <h1>These are the stats {props.userId}</h1>
    <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           <AgGridReact
               rowData={statData}
               columnDefs={colDefs}>
           </AgGridReact>
       </div>
    </>)
}
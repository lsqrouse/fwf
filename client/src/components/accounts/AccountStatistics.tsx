import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';

type accountStatisticsProps = {
    userId: number,
    username: string

}

export default function AccountStatistics(props: accountStatisticsProps) {
    const [statData, setStatData] = useState<any>(null);

    const colDefs = [
        {field: 'gameName'},
        {field: 'wins'},
        {field: 'losses'}
    ]
    if (statData == null && props.userId != -1) {
        fetch(`/api/accounts/stats?userId=${props.userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(`got data from api for user stats: with ${props.userId}`, data.games)
          setStatData(data.games);
        })
    }
    if (statData == null && props.userId == -2) {
        setStatData([])
    }

    return (<>
    <div style={{textAlign: 'center'}}>
    <h3>{props.username}'s Game Statistics</h3>
    <div className="ag-theme-alpine" style={{height: 400, width: 600}}>
           <AgGridReact
               rowData={statData}
               columnDefs={colDefs}>
           </AgGridReact>
       </div>
    </div>
    </>)
}
import React, {useState, useEffect} from 'react';
import { AgGridReact } from 'ag-grid-react';
import {Container, Row, Col} from 'reactstrap';

type accountStatisticsProps = {
    username: string

}

export default function AccountStatistics(props: accountStatisticsProps) {
    const [isLoading, setIsloading] = useState(true);
    const [statData, setStatData] = useState<any>({mafia: {}, coup: {}, wolf: {}});
    console.log("statdata is ", statData)
    const colDefs = [
        {field: 'gameName'},
        {field: 'wins'},
        {field: 'losses'}
    ]
    if (isLoading) {
        fetch(`/api/accounts/stats?userId=${props.username}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("got data from api for userstats ", data)
          setStatData(data);
          setIsloading(false)
        })
    }


    return (<>
    <div style={{textAlign: 'center'}}>
    <h3>{props.username}'s Game Statistics</h3>
    <Container style={{color: 'black', textShadow: 'none'}}>
        <Row style={{marginBottom: '5%', marginTop: '5%'}}>
            <Col style={{	borderRadius:'5px', border:'4px solid #337bc4'}}> 
            Mafia Stats <br></br> 
            Win Rate: {statData.mafia.win_rate}%<br></br>
            Wins: {statData.mafia.wins} Losses: {statData.mafia.losses} Total Games: {statData.mafia.total_games}<br></br>
            </Col>
            <Col style={{	borderRadius:'5px', border:'4px solid #337bc4'}}> 
            Coup Stats <br></br> 
            Win Rate: {statData.coup.win_rate}%<br></br>
            Wins: {statData.coup.wins} Losses: {statData.coup.losses} Total Games: {statData.coup.total_games}<br></br>
            </Col>
            <Col style={{	borderRadius:'5px', border:'4px solid #337bc4'}}> 
            WereWolf Stats <br></br> 
            Win Rate: {statData.wolf.win_rate}%<br></br>
            Wins: {statData.wolf.wins} Losses: {statData.wolf.losses} Total Games: {statData.wolf.total_games}<br></br>
            </Col>        </Row>
    </Container>

    </div>
    </>)
}
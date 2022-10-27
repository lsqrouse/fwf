import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import NoLogin from '../components/accounts/NoLogin.tsx';
import AccountInfo from '../components/accounts/AccountInfo.tsx';
import AccountStatistics from '../components/accounts/AccountStatistics.tsx';
import AccountHistory from '../components/accounts/AccountHistory.tsx';
import { Container, Row, Col} from 'reactstrap';

type accountProps = {
    userId: number
}

export default function Account(props: accountProps) {
    const userState = useSelector((state: any) => state.userState);
    const lobbyState = useSelector((state: any) => state.lobbyState);
    const [curUser, setCurUser] = useState(props.userId)
    const [view, setView] = useState("info");
    console.log("lobbystate", lobbyState)

    console.log("userstate is", userState)
    return <>
    {userState.token == undefined ? (<>
    {/* Page displayed when we have no token, and thus are not logged in */}
        <NoLogin/>
    </>) : (<>
    {/* Page displayed when we are logged in */}
        <Container>
            <Row>
                <Col><button onClick={() => {setView("info")}}>Info</button></Col>
                <Col><button onClick={() => {setView("stats")}}>Statistics</button></Col>
                <Col><button onClick={() => {setView("history")}}>Game History</button></Col>
            </Row>
        </Container>
    {view == "info" ? (<AccountInfo userState={userState}/>) : (<></>)}
    {view == "stats" ? (<AccountStatistics userId={userState.userId}/>) : (<></>)}
    {view == "history" ? (<AccountHistory userId={userState.userId}/>) : (<></>)}
    </>)}
    
    </>
}
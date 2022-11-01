import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import NoLogin from '../components/accounts/NoLogin.tsx';
import AccountInfo from '../components/accounts/AccountInfo.tsx';
import AccountStatistics from '../components/accounts/AccountStatistics.tsx';
import AccountHistory from '../components/accounts/AccountHistory.tsx';
import { Container, Row, Col} from 'reactstrap';
import { useParams } from 'react-router';
import Profile from '../components/accounts/Profile.tsx';

type accountProps = {
    userId: number
}

export default function UserPage() {
    const {curUser} = useParams();
    const [view, setView] = useState("info");

    return <>
    {/* Page displayed when we are logged in */}
        <Container>
            <Row>
                <Profile userId={curUser}></Profile>
            </Row>
            <Row>
                <AccountStatistics userId={curUser}></AccountStatistics>
            </Row>
            <Row>
                <AccountHistory userId={curUser}></AccountHistory>
            </Row>
        </Container>

  
    </>
}

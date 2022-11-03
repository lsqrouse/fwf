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
    let { curUsername } = useParams()
    const [curUserId, setCurUserId] = useState(-1);

    console.log(`got ${curUsername} as username and ${curUserId} as userid`)
    if (curUserId == -1) {
        fetch(`/api/accounts/getUser?username=${curUsername}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("got this from api for userId ", data)
            setCurUserId(data.userId);
        })
    }

    return <>
    {/* Page displayed when we are logged in */}
        <Container>
            <Row className="justify-content-md-center">
                <Profile userId={curUserId} username={curUsername}></Profile>
            </Row>
            <hr style={{borderTop:'5px solid blue'}}></hr>
            <Row className="justify-content-md-center">
                <AccountStatistics userId={curUserId} username={curUsername}></AccountStatistics>
            </Row>
            <Row className="justify-content-md-center">
                <AccountHistory userId={curUserId} username={curUsername}></AccountHistory>
            </Row>
        </Container>

  
    </>
}

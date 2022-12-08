import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import NoLogin from '../components/accounts/NoLogin.tsx';
import AccountInfo from '../components/accounts/AccountInfo.tsx';
import AccountStatistics from '../components/accounts/AccountStatistics.tsx';
import AccountHistory from '../components/accounts/AccountHistory.tsx';
import { Container, Row, Col} from 'reactstrap';
import '../styles/accounts/Account.css';
import {Link} from 'react-router-dom'


type accountProps = {
    userId: number
}

export default function Account(props: accountProps) {
    const userState = useSelector((state: any) => state.userState);
    const [lookupUser, setLookupUser] = useState('');
    const [isLoading, setIsLoading] = useState(false)


    return <>
    {userState.token == undefined ? (<>
    {/* Page displayed when we have no token, and thus are not logged in */}
        <NoLogin/>
    </>) : (<>
    {/* Page displayed when we are logged in */}
    <div className='pageContent'>

    <header className='header-area'>
      <Container style={{maxWidth:'100%', justifyContent:'center', }}>
      <Row style={{paddingBottom: '1%', paddingTop: '1%'}}>
        <Col className='col-2'>
        </Col>
        <Col className='col-2'>
        <Link to="/">
          <button className='second-button' >Home</button>
        </Link>
        </Col>
        <Col className='col-4 siteHeader'>
          <h1>Fun with Friends</h1>
        </Col>
        <Col className='col-2'>
        <input type="text" placeholder="Username" onChange={(e) => setLookupUser(e.target.value)} />
                        <Link to={`/u/${lookupUser}`}>Search</Link>
        </Col>
        <Col className='col-2'>
        </Col>
      </Row>
      </Container>
      </header>
       
        <Container>
        <div className='myBox'>
            <Row >
                <Col></Col>
                <Col>
                    <AccountInfo userState={userState}/>
                    <hr style={{borderTop:'5px solid blue'}}></hr>

                    <AccountStatistics userId={userState.userId} username={userState.username}/>
                    <AccountHistory userId={userState.userId} username={userState.username}/>
                </Col>
                <Col></Col>
            </Row>
            </div>
        </Container>
        </div>

    </>)}
    
    </>
}
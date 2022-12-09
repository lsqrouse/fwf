import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import NoLogin from '../components/accounts/NoLogin.tsx';
import AccountInfo from '../components/accounts/AccountInfo.tsx';
import AccountStatistics from '../components/accounts/AccountStatistics.tsx';
import AccountHistory from '../components/accounts/AccountHistory.tsx';
import { Container, Row, Col} from 'reactstrap';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import Profile from '../components/accounts/Profile.tsx';
import defaultPFP from "../images/pfp_default.jpg"

type accountProps = {
    userId: number
}

export default function UserPage() {
    let { curUsername } = useParams();
    const [lookupUser, setLookupUser] = useState('');
    const [profDesc, setProfDesc] = useState('');

    if (profDesc == '') {
      console.log("querying for profDesc")
        fetch(`/api/accounts/getUser?username=${curUsername}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("got this from api for profDesc ", data)
            setProfDesc(data.profDesc);
        })
    
    }
    console.log("curUnamis", curUsername, profDesc)
    return <>{profDesc != undefined ? (<>
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
            <Row className="justify-content-md-center">
                <Profile  username={curUsername}></Profile>
            </Row>
            <hr style={{borderTop:'5px solid blue'}}></hr>
            <Row>
              <Col className='col-4'>
              <div className='pfp'>
              <img  src={defaultPFP} />
              </div>
              </Col>
              <Col className='col-8'>
                <div className='profDesc'>
                {profDesc}

                </div>
              </Col>
            
            </Row>
            <Row className="justify-content-md-center">
                <AccountStatistics  username={curUsername}></AccountStatistics>
            </Row>
            <Row className="justify-content-md-center">
                <AccountHistory username={curUsername}></AccountHistory>
            </Row>
  </div>
        </Container>
  
        

  </div>
  </>) : (<>
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
  
  <Container style={{marginTop: '10%'}}>

            <Row className="justify-content-md-center">
              <h2>{curUsername} was not found...</h2>
            </Row>


        </Container>
  
        

  </div></>)}
    </>
}

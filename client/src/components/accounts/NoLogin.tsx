import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

export default function NoLogin() {
    return <>
    <div style={{textAlign: 'center'}}>
    <h1>Please Log in to see the account page</h1>
        <Link to="/"><button>Return to Home Page</button></Link>
    </div>
        
    </>
}
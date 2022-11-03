import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

export default function NoLogin() {
    return <>
        <h1>You aren't logged in you bum.</h1>
        <Link to="/"></Link>
    </>
}
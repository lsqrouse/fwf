import React, {useState, useEffect} from 'react';

type accountStatisticsProps = {
    userId: number,

}

export default function AccountHistory(props: accountStatisticsProps) {
    return (<>
    <h1> These are the history, {props.userId}</h1>
    </>)
}
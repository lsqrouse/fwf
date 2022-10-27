import React, {useState, useEffect} from 'react';

type accountStatisticsProps = {
    userId: string,

}

export default function AccountStatistics(props: accountStatisticsProps) {
    return (<>
    <h1> These are the stats, {props.userId}</h1>
    </>)
}
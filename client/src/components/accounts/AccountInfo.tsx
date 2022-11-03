import React, {useState, useEffect} from 'react';

type AccountInfoProps = {
    userState: any,
};
export default function AccountInfo (props: AccountInfoProps) {
    return <>
    <div style={{textAlign: 'center'}}>
        <h1>Hello There {props.userState.username}</h1>
        
    </div>
    </>;
}
import React, {useState, useEffect} from 'react';

type AccountInfoProps = {
    userState: any,
};
export default function AccountInfo (props: AccountInfoProps) {
    return (<>
        <h1>Hello There {props.userState.username}</h1>
    </>);
}
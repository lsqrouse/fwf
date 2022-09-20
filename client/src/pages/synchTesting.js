import React from 'react';
import useState from 'react';

function SyncTesting() {
    const [num, setNum] = useState(0);

    const increaseNum = () => {
        setNum(num + 1);
    }

    return (<div>
        <h> This is a test to see if something changes : {num}</h>
        <br/>
        <button onClick={increaseNum} > Increase Num</button>
    </ div>)
}

export default SyncTesting;
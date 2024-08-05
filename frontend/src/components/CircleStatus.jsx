import { Fragment } from 'react';

function CircleStatus({status}) {
    let backgroundColor;

    let grayBg = 'bg-gray-400';
    let greenBg = 'bg-green-500';
    let redBg = 'bg-red-500';

    if (status === 'unknown') {
        backgroundColor = grayBg;
    } else if (status === 'Alive') {
        backgroundColor = greenBg;
    } else {
        backgroundColor = redBg;
    }

    return (
        <Fragment>
            <span className={`inline-block rounded-full h-2 w-2 mr-1 ${backgroundColor}`}></span>
        </Fragment>
    );
}

export default CircleStatus;
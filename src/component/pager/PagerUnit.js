import React from 'react';

const PagerUnit = ({num, setCurPage}) => {

    const onClick = () => {
        setCurPage(num)
    }

    return (
        <li onClick={onClick} className="page-item" id="page"><a className="page-link">{num}</a></li>
    );
};

export default PagerUnit;

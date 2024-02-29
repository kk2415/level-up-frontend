import React from 'react';

const HorizonLine = ({border}) => {
    return (
        <>
            {
                border === undefined &&
                <div className="horizontal">
                </div>
            }
            {
                border === 1 &&
                <div className="horizontal border-1">
                </div>
            }
            {
                border === 2 &&
                <div className="horizontal border-2">
                </div>
            }
            {
                border === 3 &&
                <div className="horizontal border-3">
                </div>
            }
            {
                border === 4 &&
                <div className="horizontal border-4">
                </div>
            }
            {
                border === 5 &&
                <div className="horizontal border-5">
                </div>
            }
        </>
    );
};

export default HorizonLine;

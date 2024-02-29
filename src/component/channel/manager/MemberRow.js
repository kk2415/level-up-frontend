import React, {useState, useEffect, useContext, useLayoutEffect} from 'react';

import { S3_URL } from "../../../api/const/BackEndHost"

const MemberRow = ({member}) => {
    const IMG_DIR = S3_URL + member.storeFileName

    return (
        <>
            {
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={IMG_DIR} className="img-fluid rounded-start" style={{ height: '100%', objectFit: "fill"}}/>
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{member.nickname}</h5>
                                <p className="card-text">백엔드</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default MemberRow;

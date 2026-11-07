import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewBtn.css';

const ViewBtn = () => {
    const navigate = useNavigate();

    return (
        <div className="view_all_wrapper">
            <button className="view_all_btn" onClick={() => navigate('/category/all')}>View All</button>
        </div>
    );
};

export default ViewBtn;

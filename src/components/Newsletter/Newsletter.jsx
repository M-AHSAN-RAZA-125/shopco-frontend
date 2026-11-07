import React from 'react';
import './Newsletter.css';

const Newsletter = () => {
    return (
        <div className="newsletter_wrapper">
            <div className="newsletter_card">
                <h2>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
                <div className="newsletter_form">
                    <div className="input_box">
                        <input type="email" placeholder="Enter your email address" />
                    </div>
                    <button className="subscribe_btn">Subscribe to Newsletter</button>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;
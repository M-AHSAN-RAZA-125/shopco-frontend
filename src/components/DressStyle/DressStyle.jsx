import React from 'react';
import './DressStyle.css';
import { Link } from 'react-router-dom';


const DressStyle = () => {
    return (
        <section className="dress_style_container">
            <div className="dress_style_card">
                <h2 className="dress_style_heading">BROWSE BY DRESS STYLE</h2>

                <div className="style_grid">
                    {/* Row 1: Casual (Small) & Formal (Big) */}
                    <Link to="/category/casual" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="style_box small_box casual_bg">
                            <span className="style_title">Casual</span>
                        </div>
                    </Link>

                    <Link to="/category/formal" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="style_box big_box formal_bg">
                            <span className="style_title">Formal</span>
                        </div>
                    </Link>

                    {/* Row 2: Party (Big) & Gym (Small) */}
                    <Link to="/category/party" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="style_box big_box party_bg">
                            <span className="style_title">Party</span>
                        </div>
                    </Link>

                    <Link to="/category/gym" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="style_box small_box gym_bg">
                            <span className="style_title">Gym</span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default DressStyle;
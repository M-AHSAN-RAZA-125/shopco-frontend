import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faGithub, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons'



const Footer = () => {
    return (
        <footer className="footer_section">
            <div className="footer_container">
                {/* Top Grid: Brand info & Links */}
                <div className="footer_top">
                    {/* Brand Col */}
                    <div className="footer_brand">
                        <h2 className="footer_logo">SHOP.CO</h2>
                        <p className="footer_desc">
                            We have clothes that suits your style and which you're proud to wear. From women to men.
                        </p>
                        <div className="social_links">
                            <a href="#twitter" aria-label="Twitter"> <FontAwesomeIcon className='social' icon={faXTwitter} /></a>
                            <a href="#facebook" aria-label="Facebook"><FontAwesomeIcon className='social' icon={faFacebook} /></a>
                            <a href="#instagram" aria-label="Instagram"><FontAwesomeIcon className='social' icon={faInstagram} /></a>
                            <a href="#github" aria-label="Github"><FontAwesomeIcon className='social' icon={faGithub} /></a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="footer_links_grid">
                        <div className="footer_col">
                            <h4>COMPANY</h4>
                            <ul>
                                <li><a href="#about">About</a></li>
                                <li><a href="#features">Features</a></li>
                                <li><a href="#works">Works</a></li>
                                <li><a href="#career">Career</a></li>
                            </ul>
                        </div>

                        <div className="footer_col">
                            <h4>HELP</h4>
                            <ul>
                                <li><a href="#support">Customer Support</a></li>
                                <li><a href="#delivery">Delivery Details</a></li>
                                <li><a href="#terms">Terms & Conditions</a></li>
                                <li><a href="#privacy">Privacy Policy</a></li>
                            </ul>
                        </div>

                        <div className="footer_col">
                            <h4>FAQ</h4>
                            <ul>
                                <li><a href="#account">Account</a></li>
                                <li><a href="#manage">Manage Deliveries</a></li>
                                <li><a href="#orders">Orders</a></li>
                                <li><a href="#payments">Payments</a></li>
                            </ul>
                        </div>

                        <div className="footer_col">
                            <h4>RESOURCES</h4>
                            <ul>
                                <li><a href="#ebooks">Free eBooks</a></li>
                                <li><a href="#tutorial">Development Tutorial</a></li>
                                <li><a href="#blog">How to - Blog</a></li>
                                <li><a href="#playlist">Youtube Playlist</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Divider Line */}
                <hr className="footer_divider" />

                {/* Bottom Bar: Copyright & Payment Icons */}
                <div className="footer_bottom">
                    <p className="copyright_text">Shop.co © 2000-2023, All Rights Reserved</p>
                    <div className="payment_badges">
                        <span className="pay_card">Visa</span>
                        <span className="pay_card">Mastercard</span>
                        <span className="pay_card">PayPal</span>
                        <span className="pay_card">Apple Pay</span>
                        <span className="pay_card">G Pay</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
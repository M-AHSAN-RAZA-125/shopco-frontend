import React from 'react';
import './Hero.css';
import hero_img from '../../assets/hero_img.png';

const Hero = () => {
    return (
        <section className='hero_sec'>
            <div className='hero_container'>

                {/* LEFT CONTENT AREA */}
                <div className='hero_content'>
                    <div className='hero_1'>
                        <div className='hero_txt'>
                            <h1>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
                            <div className='hero_txt_2'>
                                <p>
                                    Browse through our diverse range of meticulously crafted garments,
                                    designed to bring out your individuality and cater to your sense of style.
                                </p>
                                <button className='hero_btn'>Shop Now</button>
                            </div>
                        </div>
                    </div>

                    <div className='hero_2'>
                        <div className="hero_num">
                            <div className="numbers">
                                <h1>200+</h1>
                                <p>International Brands</p>
                            </div>

                            <div className="stat_divider"></div>

                            <div className="numbers">
                                <h1>2,000+</h1>
                                <p>High-Quality Products</p>
                            </div>

                            <div className="stat_divider desktop_only"></div>

                            <div className="numbers full_mobile">
                                <h1>30,000+</h1>
                                <p>Happy Customers</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT IMAGE AREA */}
                <div className='hero_img_wrapper'>
                    <svg className="star_icon star_big" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M52 0C52 28.7188 75.2812 52 104 52C75.2812 52 52 75.2812 52 104C52 75.2812 28.7188 52 0 52C28.7188 52 52 28.7188 52 0Z" fill="black" />
                    </svg>

                    <svg className="star_icon star_small" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28 0C28 15.4639 40.5361 28 56 28C40.5361 28 28 40.5361 28 56C28 40.5361 15.4639 28 0 28C15.4639 28 28 15.4639 28 0Z" fill="black" />
                    </svg>

                    <img src={hero_img} alt="Hero Style Models" className='hero_img' />
                </div>

            </div>
        </section>
    );
};

export default Hero;
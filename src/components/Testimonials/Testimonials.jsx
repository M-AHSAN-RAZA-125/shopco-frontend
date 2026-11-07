import React from 'react';
import './Testimonials.css';

const testimonialsData = [
    {
        id: 1,
        name: "Sarah M.",
        review: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
    },
    {
        id: 2,
        name: "Alex K.",
        review: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."
    },
    {
        id: 3,
        name: "James L.",
        review: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
    }
];

const Testimonials = () => {
    return (
        <section className="testimonials_container">
            <div className="testimonials_header">
                <h2>OUR HAPPY CUSTOMERS</h2>
                <div className="arrow_btns">
                    <button className="arrow_btn">←</button>
                    <button className="arrow_btn">→</button>
                </div>
            </div>

            <div className="testimonials_grid">
                {testimonialsData.map((item) => (
                    <div className="testimonial_card" key={item.id}>
                        <div className="stars">★★★★★</div>
                        <div className="user_name">
                            <span>{item.name}</span>
                            <span className="verify_badge">✔</span>
                        </div>
                        <p className="user_review">"{item.review}"</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
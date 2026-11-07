import React, { useState } from "react";
import reviewsData from "../../data/reviews.json";
import "./ProductTabs.css";

const ProductTabs = () => {
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="product_tabs_section">
      {/* Tabs Header */}
      <div className="tabs_header">
        <button 
          className={`tab_btn ${activeTab === "details" ? "active" : ""}`} 
          onClick={() => setActiveTab("details")}
        >
          Product Details
        </button>
        <button 
          className={`tab_btn ${activeTab === "reviews" ? "active" : ""}`} 
          onClick={() => setActiveTab("reviews")}
        >
          Rating & Reviews
        </button>
        <button 
          className={`tab_btn ${activeTab === "faqs" ? "active" : ""}`} 
          onClick={() => setActiveTab("faqs")}
        >
          FAQs
        </button>
      </div>

      {/* Tabs Content */}
      <div className="tab_content">
        {activeTab === "reviews" && (
          <div className="reviews_container">
            {/* Reviews Top Actions Bar */}
            <div className="reviews_top_bar">
              <h3>All Reviews <span>({reviewsData.length})</span></h3>
              <div className="actions">
                <button className="filter_btn">
                  <span>Latest</span> ▼
                </button>
                <button className="write_review_btn">Write a Review</button>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="reviews_grid">
              {reviewsData.map((review) => (
                <div key={review.id} className="review_card">
                  <div className="card_header">
                    <div className="stars">{"★".repeat(review.rating)}</div>
                    <span className="dots">•••</span>
                  </div>
                  <h4 className="user_name">
                    {review.name}
                    {review.verified && <span className="verified_badge">✔</span>}
                  </h4>
                  <p className="user_comment">"{review.comment}"</p>
                  <p className="post_date">{review.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="tab_placeholder">Product details content goes here.</div>
        )}

        {activeTab === "faqs" && (
          <div className="tab_placeholder">Frequently asked questions go here.</div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
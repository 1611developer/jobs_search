import React from 'react';

const ProductsCard = ({ listing }) => {
    if (!listing.product_title) return null;

    return (
        <div className="products-card">
            <img
                src={listing.product_photos && listing.product_photos.length > 0 ? listing.product_photos[0] : ''}
                alt={listing.product_title}
                className="product-image"
            />
            <h3>{listing.product_title}</h3>
            <p><strong>{listing.offer.store_name}</strong></p>
            <p className="price">{listing.offer.price}</p>
            <p className="rating">Rating: {listing.product_rating} ({listing.product_num_reviews} reviews)</p>
            <a href={listing.offer.offer_page_url} target="_blank" rel="noopener noreferrer" className="view-button">View Product</a>
        </div>
    );
};

export default ProductsCard;
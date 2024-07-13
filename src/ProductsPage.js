import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const ProductsCard = lazy(() => import("./components/ProductsCard"));

const ProductsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedFetchData = useCallback(
        debounce(async (searchQuery, page, append = false) => {
            if (!searchQuery) return;
            append ? setIsLoadingMore(true) : setIsLoading(true);
            const options = {
                method: 'GET',
                url: 'https://real-time-product-search.p.rapidapi.com/search',
                params: {
                    q: searchQuery,
                    country: 'us',
                    language: 'en',
                    page: (page + 1).toString(),
                    limit: '20',
                    sort_by: 'BEST_MATCH',
                    product_condition: 'ANY',
                    min_rating: 'ANY'
                },
                headers: {
                    'x-rapidapi-key': 'ddec5a9d35msh1d55d8c08bba2ffp1fc4c6jsn5016f01225ad',
                    'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com'
                }
            };

            try {
                const { data } = await axios.request(options);
                setListings(prevListings => append ? [...prevListings, ...data.data] : data.data);
                setHasMore(data.data.length === 20); // If we get exactly 20 results, there might be more
            } catch (error) {
                console.error("Error fetching data: ", error);
            } finally {
                append ? setIsLoadingMore(false) : setIsLoading(false);
            }
        }, 500), // Delay of 500ms
        [] // Debounce itself is stable and doesn't need dependencies here
    );

    const handleSubmit = (event) => {
        event.preventDefault();
        setListings([]);
        setCurrentPage(0);
        setSearchQuery(searchInput);
        debouncedFetchData(searchInput, 0);
    };

    const handleLoadMore = () => {
        window.scrollTo(0, 0); // Scroll to the top of the page
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        debouncedFetchData(searchQuery, nextPage, true);
    };

    useEffect(() => {
        if (searchQuery) {
            debouncedFetchData(searchQuery, currentPage);
        }
    }, [searchQuery, currentPage, debouncedFetchData]);

    return (
        <div className="container">
            <div className="logo-title">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/440px-Y_Combinator_logo.svg.png"
                    alt=""/>
                <h1 onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>FindNBuy</h1>
            </div>
            <h2>Find products, new or used, from the web</h2>
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    placeholder="Search for products"
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div className="products-container">
                <Suspense fallback={<div className="spinner"><i className="fas fa-spinner fa-spin"></i></div>}>
                    {listings.map((listing, index) => (
                        <ProductsCard listing={listing} key={index}/>
                    ))}
                </Suspense>
            </div>
            {isLoading && (
                <div className="spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
            )}
            {!isLoading && hasMore && listings.length > 0 && (
                <div className="load-more-button-container">
                    <button onClick={handleLoadMore} className="load-more-button">
                        Load More
                    </button>
                </div>
            )}
            {isLoadingMore && (
                <div className="spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
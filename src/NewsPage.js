import { useState, useEffect } from "react";
import axios from "axios";
import NewsCard from "./components/NewsCard";
import ReactPaginate from "react-paginate";

const NewsPage = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const handlePageChange = event => {
        console.log(event);
        setCurrentPage(event.selected);
    };

    const handleSubmit = event => {
        event.preventDefault();
        setCurrentPage(0);
        setQuery(searchInput);
    };

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            const options = {
                method: 'GET',
                url: 'https://job-search-api1.p.rapidapi.com/v1/job-description-search',
                params: {
                    q: query || 'software developer internship',
                    page: currentPage + 1, // API page index starts from 1
                    country: 'us',
                    city: ''
                },
                headers: {
                    'x-rapidapi-key': 'ddec5a9d35msh1d55d8c08bba2ffp1fc4c6jsn5016f01225ad',
                    'x-rapidapi-host': 'job-search-api1.p.rapidapi.com'
                }
            };

            try {
                const { data } = await axios.request(options);
                const { jobs, total_results } = data;
                setArticles(jobs);
                // Assuming 10 results per page for pagination calculation
                setTotalPages(Math.ceil(total_results / 10));
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [currentPage, query]);

    return (
        <div className="container">
            <div className="logo-title">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Y_Combinator_logo.svg/440px-Y_Combinator_logo.svg.png" alt="" />
                <h1>Software Internship Search</h1>
            </div>
            <form className="search-form" onSubmit={handleSubmit}>
                <input
                    placeholder="Search for jobs"
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div className="news-container">
                {isLoading ? (
                    <p>Loading....</p>
                ) : (
                    articles.map((article, index) => (
                        <NewsCard article={article} key={index} />
                    ))
                )}
            </div>
            <ReactPaginate
                nextLabel=">>"
                previousLabel="<<"
                breakLabel="..."
                forcePage={currentPage}
                pageCount={totalPages}
                renderOnZeroPageCount={null}
                onPageChange={handlePageChange}
                className="pagination"
                activeClassName="active-page"
                previousClassName="previous-page"
                nextClassName="next-page"
            />
        </div>
    );
};

export default NewsPage;

const NewsCard = ({ article }) => {
    if(!article.title) return null;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="news-card">
            <h3>{article.title}</h3>
            <p>Location: {article.location}</p>
            <p>Company: {article.company_name}</p>
            <p>Date Posted: {formatDate(article.publication_time)}</p>
            <a href={article.application_url} target="_blank" rel="noreferrer">Read More</a>
        </div>
    )
};

export default NewsCard;
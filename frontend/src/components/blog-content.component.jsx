const Image = ({ url, caption }) => {
    return (
        <div className="blog-content-image">
            <img src={url} />

            {
                caption.length ? 
                <p className="blog-content-image-caption">
                    {caption}
                </p> 
                : ""
            }
        </div>
    );
};

const Quote = ({ quote, caption }) => {
    return (
        <div className="blog-content-quote">
            <p className="blog-content-quote-text" dangerouslySetInnerHTML={{ __html: quote }}></p>
            {
                caption.length ? 
                <p className="blog-content-quote-caption">{caption}</p> 
                : ""
            }
        </div>
    );
};

const List = ({ style, items }) => {
    return (
        <ol className={`blog-content-list ${style === "ordered" ? "ordered" : "unordered"}`}>
            {
                items.map((listItem, i) => {
                    return <li key={i} className="blog-content-list-item" dangerouslySetInnerHTML={{ __html: listItem }}></li>;
                })
            }
        </ol>
    );
};

const BlogContent = ({ block }) => {

    if (!block?.type || !block?.data) {
        return null;
    }

    let { type, data } = block;

    if (type === "paragraph") {
        return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
    }

    if (type === "header") {
        if (data.level === 3) {
            return <h3 className="blog-content-heading blog-content-heading-3" dangerouslySetInnerHTML={{ __html: data.text }}></h3>;
        }
        return <h2 className="blog-content-heading blog-content-heading-2" dangerouslySetInnerHTML={{ __html: data.text }}></h2>;
    }

    if (type === "image") {
        return <Image url={data.file?.url} caption={data.caption || ""} />;
    }

    if (type === "quote") {
        return <Quote quote={data.text} caption={data.caption} />;
    }

    if (type === "list") {
        return <List style={data.style} items={data.items || []} />;
    }

    return null;
};

export default BlogContent;

// import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post";
import InPageNavigation from "../components/inpage-navigation";

const HomePage = () => {
    return (
        <div>
            <section className="h-cover flex justify-center gap-10">
                <div className="w-full">
                    <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>
                        <>
                            {
                                blogs == null ? <Loader /> :
                                blogs.map((blog, i) => {
                                    return (
                                        <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                    )
                                })
                            }
                        </>
                    </InPageNavigation>
                </div>

                <div>

                </div>
            </section>
        </div>
    )
}

export default HomePage;
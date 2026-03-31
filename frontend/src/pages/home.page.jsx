// import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation";

const HomePage = () => {
    return (
        <div>
            <section className="h-cover flex justify-center gap-10">
                <div className="w-full">
                    <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>
                        <h1>Lastest Blog here</h1>

                        <h1>Trending Blog here</h1>
                    </InPageNavigation>
                </div>

                <div>

                </div>
            </section>
        </div>
    )
}

export default HomePage;
import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {
    const activeTabLineRef = useRef();
    const activeTabRef = useRef();

    const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    const updateActiveTab = (button, index) => {
        if (!button || !activeTabLineRef.current) {
            return;
        }

        const { offsetWidth, offsetLeft } = button;

        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";

        setInPageNavIndex(index);
    };

    useEffect(() => {
        updateActiveTab(activeTabRef.current, defaultActiveIndex);
    }, [defaultActiveIndex, routes]);

    return (
        <>
            <div className="inpage-nav">
                {
                    routes.map((route, i) => {
                        return (
                            <button 
                                type="button"
                                ref={i === defaultActiveIndex ? activeTabRef : null}
                                key={route}
                                className={
                                    "inpage-nav-btn " +
                                    (inPageNavIndex === i ? "active" : "") +
                                    (defaultHidden.includes(route) ? " hide-on-desktop" : "")
                                }
                                onClick={(e) => updateActiveTab(e.currentTarget, i)}
                            >
                                { route }
                            </button>
                        );
                    })
                }

                <hr ref={activeTabLineRef} className="inpage-nav-line"/>
            </div>

            {/* Khu vực hiển thị nội dung (Children) */}
            {
                Array.isArray(children) ? children[inPageNavIndex] : children
            }
        </>
    )
}

export default InPageNavigation;
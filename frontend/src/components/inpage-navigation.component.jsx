import { useEffect, useRef, useState } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {
    activeTabLineRef = useRef();
    activeTabRef = useRef();

    let [ inPageNavIndex, setInPageNavIndex ] = useState(defaultActiveIndex);

    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;

        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";

        setInPageNavIndex(i);
    }

    useEffect(() => {
        changePageState( activeTabRef.current, defaultActiveIndex );
    },  []) 

    return (
        <>
            <div className="inpage-nav">
                {
                    routes.map((route, i) => {
                        return (
                            <button 
                            ref={ i == defaultActiveIndex ? activeTabRef : null }
                            key={i} 
                            className={"inpage-nav-btn " + (inPageNavIndex == i ? "active" : "") + 
                                (defaultHidden.includes(route) ? " hide-on-desktop" : "") }
                            onClick={(e) => { changePageState(e.target, i) }}>
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
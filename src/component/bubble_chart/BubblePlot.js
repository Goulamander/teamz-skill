import React, {useEffect} from "react";
import * as bubble from "../../assets/js/bubble_d3/bubble";
import "./BubblePlot.css";

export default function BubblePlot({data, maxWidth}){
    useEffect(() => {
        bubble.init(maxWidth);
        window.addEventListener('resize', bubble.draw.bind(null, data));
    }, [])

    useEffect(() => {
        window.addEventListener('resize', bubble.draw.bind(null, data));
        bubble.draw(data);
    }, [data])

    return (
        <div className="plotWrapper"></div>
    )
}
import React, {useEffect} from "react";
import * as bubble from "../../assets/js/bar_d3/bar";
import "./BarPlot.css";

export default function BubblePlot({data, users, maxWidth, highlightUserEmail}){
    useEffect(() => {
        bubble.init(maxWidth);
        window.addEventListener('resize', bubble.draw.bind(null, data, users || [], highlightUserEmail));
    }, [])

    useEffect(() => {
        window.addEventListener('resize', bubble.draw.bind(null, data, users || [], highlightUserEmail));
        bubble.draw(data, users || [], highlightUserEmail);
    }, [data, users, highlightUserEmail])

    return (
        <div className="plotWrapper"></div>
    )
}
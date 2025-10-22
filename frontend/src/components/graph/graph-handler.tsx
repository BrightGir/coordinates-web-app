import type {ResultItem} from "../../redux/types.ts";
import {type JSX} from "react";
import styles from "./Graph.module.css"

export const ONE_UNIT_PX = 50;
export const centerX = 350;
export const centerY = 350;

export const getPointView = (point: ResultItem, globalR: number): JSX.Element => {
    const x = parseFloat(point.x.replace(',','.'));
    const y = parseFloat(point.y.replace(',','.'));
    const r = parseFloat(point.r.replace(',','.'));
    if(globalR <= 0) return (<></>);

    const prop = globalR / r;
    const cx = centerX + x * ONE_UNIT_PX * prop;
    const cy = centerY - y * ONE_UNIT_PX * prop;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={3.5}
            fill={point.hit ? "#9ACD32" : "#FF0000"}
            stroke="white"
            strokeWidth={1}
        />
    );
}

export const getLabelsView = (globalR: number): JSX.Element[] => {
    const R = globalR;
    if (R <= 0) {
        return [
            <text className={styles.graphText} id="label-x-r" x={0} y={0} key="x-r"></text>,
            <text className={styles.graphText} id="label-x-r-half" x={0} y={0} key="x-r-half"></text>,
            <text className={styles.graphText} id="label-x-neg-r-half" x={0} y={0} key="x-neg-r-half"></text>,
            <text className={styles.graphText} id="label-x-neg-r" x={0} y={0} key="x-neg-r"></text>,
            <text className={styles.graphText} id="label-y-r" x={0} y={0} key="y-r"></text>,
            <text className={styles.graphText} id="label-y-r-half" x={0} y={0} key="y-r-half"></text>,
            <text className={styles.graphText} id="label-y-neg-r-half" x={0} y={0} key="y-neg-r-half"></text>,
            <text className={styles.graphText} id="label-y-neg-r" x={0} y={0} key="y-neg-r"></text>,
        ];
    }

    const rPx = R * ONE_UNIT_PX;
    const rHalfPx = (R / 2) * ONE_UNIT_PX;

    return [
        <text className={styles.graphText} id="label-x-r" x={centerX + rPx} y={centerY + 15} key="x-r">{R}</text>,
        <text className={styles.graphText} id="label-x-r-half" x={centerX + rHalfPx} y={centerY + 15} key="x-r-half">{R / 2}</text>,
        <text className={styles.graphText} id="label-x-neg-r-half" x={centerX - rHalfPx} y={centerY + 15} key="x-neg-r-half">{-R / 2}</text>,
        <text className={styles.graphText} id="label-x-neg-r" x={centerX - rPx} y={centerY + 15} key="x-neg-r">{-R}</text>,

        <text className={styles.graphText} id="label-y-r" x={centerX + 15} y={centerY - rPx} key="y-r">{R}</text>,
        <text className={styles.graphText} id="label-y-r-half" x={centerX + 15} y={centerY - rHalfPx} key="y-r-half">{R / 2}</text>,
        <text className={styles.graphText} id="label-y-neg-r-half" x={centerX + 15} y={centerY + rHalfPx} key="y-neg-r-half">{-R / 2}</text>,
        <text className={styles.graphText} id="label-y-neg-r" x={centerX + 15} y={centerY + rPx} key="y-neg-r">{-R}</text>,
    ];
}

export const getShapesView = (globalR: number): JSX.Element => {
    if (globalR <= 0) {
        return (<></>);
    }

    const R_PX = globalR * ONE_UNIT_PX;
    const R_HALF_PX = (globalR / 2) * ONE_UNIT_PX;

    const rectX = centerX;
    const rectY = centerY - R_HALF_PX;
    const rectWidth = R_PX;
    const rectHeight = R_HALF_PX;

    const triangleP1 = `${centerX},${centerY}`;
    const triangleP2 = `${centerX + R_PX},${centerY}`;
    const triangleP3 = `${centerX},${centerY + R_PX}`;

    const pathData = `
            M ${centerX},${centerY} 
            L ${centerX - R_PX},${centerY} 
            A ${R_PX},${R_PX} 0 0,0 ${centerX},${centerY + R_PX} 
            Z
        `;
    return (
        <g fill="#302f2d" stroke="black" strokeWidth="1">
            <rect
                x={rectX}
                y={rectY}
                width={rectWidth}
                height={rectHeight}
            />

            <polygon
                points={`${triangleP1} ${triangleP2} ${triangleP3}`}
            />

            <path
                d={pathData}
            />
        </g>
    );
}


'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

type DataPoint = {
    value: number;
    time: string;
};

type GraphProps = {
    pointsCount: number;
    data: DataPoint[];
};

export const Graph: React.FC<GraphProps> = ({ pointsCount, data }) => {
    const sortedData = [...data]
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        .slice(-pointsCount)
        .map((point) => ({
            ...point,
            time: new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

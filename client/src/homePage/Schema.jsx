import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import './Schema.css';

const CHART_CONFIG = [
    { key: 'TODO',        label: 'Pending',     color: '#8b5cf6' },
    { key: 'IN_PROGRESS', label: 'In Progress',  color: '#06b6d4' },
    { key: 'DONE',        label: 'Completed',    color: '#10b981' },
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, value, color } = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <span className="chart-tooltip-color" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: color || payload[0].color, marginRight: 8 }} />
                <span className="chart-tooltip-label">{name}:</span>
                <span className="chart-tooltip-value">{value}</span>
            </div>
        );
    }
    return null;
};

export const TaskDonutChart = ({ projects = [] }) => {
    const data = CHART_CONFIG.map(({ key, label, color }) => ({
        name: label,
        value: projects.filter(p => p.status === key).length,
        color,
    }));

    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="chart-card">
            <h3 className="chart-title">Project Distribution</h3>

            <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <PieChart>
                        <Pie
                            data={total > 0 ? data : [{ name: 'No data', value: 1, color: '#e2e8f0' }]}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={total > 0 ? 4 : 0}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={6}
                        >
                            {(total > 0 ? data : [{ color: '#e2e8f0' }]).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        {total > 0 && <Tooltip content={<CustomTooltip />} />}
                    </PieChart>
                </ResponsiveContainer>

                {/* Center label */}
                <div className="chart-center">
                    <div className="chart-center-value">{total}</div>
                    <div className="chart-center-label">Total</div>
                </div>
            </div>

            {/* Legend */}
            <div className="chart-legend">
                {data.map((item) => (
                    <div key={item.name} className="chart-legend-item">
                        <div className="chart-legend-color" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                        <span className="chart-legend-value">({item.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const TaskPriorityChart = ({ projects = [] }) => {
    const lowCount = projects.filter(p => p.priority?.toUpperCase() === 'LOW').length;
    const mediumCount = projects.filter(p => p.priority?.toUpperCase() === 'MEDIUM').length;
    const highCount = projects.filter(p => p.priority?.toUpperCase() === 'HIGH').length;

    const data = [
        { name: 'Low', value: lowCount, color: '#10b981' },
        { name: 'Medium', value: mediumCount, color: '#f59e0b' },
        { name: 'High', value: highCount, color: '#f43f5e' },
    ];

    return (
        <div className="chart-card">
            <h3 className="chart-title">Project Priority Levels</h3>
            <div className="chart-body">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
                            allowDecimals={false}
                        />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
            {/* Legend */}
            <div className="chart-legend">
                {data.map((item) => (
                    <div key={item.name} className="chart-legend-item">
                        <div className="chart-legend-color" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                        <span className="chart-legend-value">({item.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskDonutChart;
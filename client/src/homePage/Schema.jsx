import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { name: 'Pending', value: 11, color: '#8b5cf6' },    // Фиолетовый
    { name: 'In Progress', value: 5, color: '#06b6d4' }, // Голубой
    { name: 'Completed', value: 2, color: '#84cc16' },   // Зеленый
];

export const TaskDonutChart = () => {
    return (
        <div style={{ width: '100%', height: 300, background: '#fff', borderRadius: '16px', padding: '20px' }}>
            <h3 style={{ fontFamily: 'sans-serif', marginBottom: '20px' }}>Task Distribution</h3>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"         // Центровка по горизонтали
                        cy="50%"         // Центровка по вертикали
                        innerRadius={60} // Радиус внутреннего отверстия
                        outerRadius={80} // Внешний радиус
                        paddingAngle={5} // Расстояние между сегментами
                        dataKey="value"
                        stroke="none"    // Убираем белую обводку
                        cornerRadius={10} // Закругление краев (доступно в новых версиях)
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>

            {/* Кастомная легенда как на скрине */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px', fontFamily: 'sans-serif', fontSize: '14px' }}>
                {data.map((item) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskDonutChart;
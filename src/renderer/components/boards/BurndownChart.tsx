import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { day: 'Day 1', ideal: 100, actual: 100 },
    { day: 'Day 2', ideal: 90, actual: 105 },
    { day: 'Day 3', ideal: 80, actual: 108 },
    { day: 'Day 4', ideal: 70, actual: 110 },
    { day: 'Day 5', ideal: 60, actual: 115 },
    { day: 'Day 6', ideal: 50, actual: 112 },
    { day: 'Day 7', ideal: 40, actual: 120 },
    { day: 'Day 8', ideal: 30, actual: 125 },
    { day: 'Day 9', ideal: 20, actual: 130 },
    { day: 'Day 10', ideal: 10, actual: 140 },
];

export const BurndownChart = () => {
    return (
        <div className="h-[300px] w-full bg-card p-4 rounded-lg border shadow-sm">
            <h3 className="text-lg font-bold mb-4">Sprint Burndown (Burnup?)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="ideal" stroke="#8884d8" strokeDasharray="5 5" name="Ideal Effort" />
                    <Line type="monotone" dataKey="actual" stroke="#ff0000" strokeWidth={3} name="Actual Suffering" />
                </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
                * Note: The 'Actual' line trending upwards indicates a healthy accumulation of new tasks and procrastination.
            </p>
        </div>
    );
};

import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card } from "../components/Card.jsx";

export function LineChartCard({ title, subtitle, data, dataKey = "value", xKey = "date" }) {
  return (
    <Card title={title} subtitle={subtitle}>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={dataKey} strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

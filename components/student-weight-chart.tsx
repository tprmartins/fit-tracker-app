
"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { month: "January", weight: 80 },
    { month: "February", weight: 79 },
    { month: "March", weight: 78.5 },
    { month: "April", weight: 77 },
    { month: "May", weight: 76 },
    { month: "June", weight: 75.5 },
]

const chartConfig = {
    weight: {
        label: "Body Weight (kg)",
        color: "hsl(262.1 83.3% 57.8%)", // violet-600
    },
} satisfies ChartConfig

export function StudentWeightChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Weight Progression</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                            top: 10,
                            bottom: 10
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            domain={['dataMin - 1', 'dataMax + 1']}
                            hide
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="weight"
                            type="monotone"
                            stroke="var(--color-weight)"
                            strokeWidth={3}
                            dot={{
                                fill: "var(--color-weight)",
                                r: 4,
                                strokeWidth: 0
                            }}
                            activeDot={{
                                r: 8,
                                strokeWidth: 2,
                                stroke: "white"
                            }}
                            className="stroke-violet-600 dark:stroke-violet-500"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none text-green-500">
                    Lost 4.5kg total <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Consistent progress over the last 6 months
                </div>
            </CardFooter>
        </Card>
    )
}

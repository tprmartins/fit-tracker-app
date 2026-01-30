
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
    { day: "Monday", workouts: 1 },
    { day: "Tuesday", workouts: 0 },
    { day: "Wednesday", workouts: 1 },
    { day: "Thursday", workouts: 1 },
    { day: "Friday", workouts: 0 },
    { day: "Saturday", workouts: 1 },
    { day: "Sunday", workouts: 0 },
]

const chartConfig = {
    workouts: {
        label: "Workouts",
        color: "hsl(217.2 91.2% 59.8%)", // blue-600
    },
} satisfies ChartConfig

export function StudentActivityChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Workouts completed this week</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="workouts"
                            fill="var(--color-workouts)"
                            radius={[6, 6, 0, 0]}
                            barSize={40}
                            className="fill-blue-600 dark:fill-blue-500 hover:fill-blue-700 dark:hover:fill-blue-400 transition-colors"
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none text-green-500">
                    Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total workouts for the current week
                </div>
            </CardFooter>
        </Card>
    )
}

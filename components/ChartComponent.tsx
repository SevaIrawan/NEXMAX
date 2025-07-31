'use client'

import { useEffect, useRef } from 'react'
import { ChartData } from '@/lib/supabase'

interface ChartComponentProps {
  data: ChartData
}

export default function ChartComponent({ data }: ChartComponentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<any>(null)

  useEffect(() => {
    if (!chartRef.current || !data.labels.length) return

    // Import Chart.js dynamically
    const initChart = async () => {
      const { Chart, registerables } = await import('chart.js/auto')
      Chart.register(...registerables)

      // Destroy existing chart
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current?.getContext('2d')
      if (!ctx) return

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: data.datasets.map(dataset => ({
            ...dataset,
            tension: 0.4,
            fill: false,
            pointBackgroundColor: dataset.borderColor,
            pointBorderColor: dataset.borderColor,
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          }))
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                color: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151'
              }
            },
            tooltip: {
              backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
              titleColor: document.documentElement.classList.contains('dark') ? '#f3f4f6' : '#374151',
              bodyColor: document.documentElement.classList.contains('dark') ? '#d1d5db' : '#6b7280',
              borderColor: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            x: {
              grid: {
                color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
              },
              ticks: {
                color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
                font: {
                  size: 12
                }
              }
            },
            y: {
              grid: {
                color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
              },
              ticks: {
                color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
                font: {
                  size: 12
                },
                callback: function(value: any) {
                  return '$' + value.toLocaleString()
                }
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          elements: {
            point: {
              hoverRadius: 8,
              hoverBorderWidth: 3
            }
          }
        }
      })
    }

    initChart()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue & Users Overview
        </h3>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-md">
            Last 7 Days
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            Last 30 Days
          </button>
        </div>
      </div>
      <div className="h-80">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  )
} 
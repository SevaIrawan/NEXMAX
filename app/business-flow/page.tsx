'use client'

import { useState } from 'react';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function BusinessFlow() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [year, setYear] = useState('2025');
  const [month, setMonth] = useState('July');
  const [currency, setCurrency] = useState('MYR');

  // Mock user data - akan diganti dengan Supabase auth
  const user = {
    username: 'admin',
    email: 'admin@nexmax.com'
  };

  const handleLogout = () => {
    // Implement logout logic with Supabase
    console.log('Logout clicked');
  };

  // Chart data configurations
  const ppcLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Conversion Rate (%)',
        data: [4.2, 3.8, 2.1, 3.9, 6.2, 6.5, 4.8],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const ppcBarData1 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'New Customers',
        data: [40, 35, 25, 30, 150, 140, 65],
        backgroundColor: '#f093fb',
      },
    ],
  };

  const ppcBarData2 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Group Join Volume',
        data: [1100, 1050, 1000, 1200, 2300, 2200, 1350],
        backgroundColor: '#4facfe',
      },
    ],
  };

  const firstDepositorLineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Deposit Rate (%)',
        data: [25, 28, 30, 32, 35, 33, 24],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const firstDepositorBarData1 = {
    labels: ['In Group', 'Not In Group'],
    datasets: [
      {
        label: 'Deposit Rate (%)',
        data: [24.22, 11.80],
        backgroundColor: ['#667eea', '#f093fb'],
      },
    ],
  };

  const firstDepositorBarData2 = {
    labels: ['In Group', 'Not In Group'],
    datasets: [
      {
        label: 'Customer Count',
        data: [78, 65],
        backgroundColor: ['#4facfe', '#10b981'],
      },
    ],
  };

  const oldMemberBarData1 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Customer Count',
        data: [900, 800, 600, 400, 1400],
        backgroundColor: '#667eea',
      },
    ],
  };

  const oldMemberBarData2 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Upgraded Members',
        data: [110, 80, 50, 30, 10],
        backgroundColor: '#f093fb',
      },
    ],
  };

  const oldMemberBarData3 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Churned Members',
        data: [70, 30, 20, 15, 5],
        backgroundColor: '#ef4444',
      },
    ],
  };

  const oldMemberLineData1 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Engagement Rate',
        data: [0.75, 0.82, 0.88, 0.92, 0.95],
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const oldMemberLineData2 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'NPS Score',
        data: [65, 72, 78, 85, 92],
        borderColor: '#f093fb',
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const oldMemberBarData4 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Upgrade Rate (%)',
        data: [12, 8, 6, 4, 1],
        backgroundColor: '#4facfe',
      },
    ],
  };

  const oldMemberLineData3 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Bronze',
        data: [8, 7, 6, 5, 4, 3, 2],
        borderColor: '#ef4444',
        tension: 0.4,
      },
      {
        label: 'Silver',
        data: [6, 5, 4, 3, 2, 1, 0.5],
        borderColor: '#f97316',
        tension: 0.4,
      },
      {
        label: 'Gold',
        data: [4, 3, 2, 1, 0.5, 0.3, 0.1],
        borderColor: '#eab308',
        tension: 0.4,
      },
      {
        label: 'Platinum',
        data: [3, 2, 1, 0.5, 0.3, 0.1, 0.05],
        borderColor: '#10b981',
        tension: 0.4,
      },
      {
        label: 'Diamond',
        data: [1, 0.5, 0.3, 0.1, 0.05, 0.02, 0.01],
        borderColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  const trafficBarData1 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Reactivation Rate',
        data: [0.65, 0.75, 0.85, 0.92, 0.98],
        backgroundColor: '#667eea',
      },
    ],
  };

  const trafficBarData2 = {
    labels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    datasets: [
      {
        label: 'Reactivated Customers',
        data: [65, 95, 105, 315, 395],
        backgroundColor: '#f093fb',
      },
    ],
  };

  const trafficDonutData = {
    labels: ['Successful', 'Failed'],
    datasets: [
      {
        data: [80.49, 19.51],
        backgroundColor: ['#10b981', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <Layout
      pageTitle="Business Flow"
      subHeaderTitle="Business Flow"
      darkMode={darkMode}
      sidebarExpanded={sidebarExpanded}
      onToggleDarkMode={() => setDarkMode(!darkMode)}
      onLogout={handleLogout}
    >
      {/* SUB HEADER - EMPTY FOR NOW */}
      <SubHeader title="Business Flow" />
      
      {/* CONTENT - BUSINESS FLOW MODULES */}
      <div style={{
        padding: '40px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* MODULE 1: PPC Service */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          marginBottom: '40px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 12px 0',
              color: '#1e293b'
            }}>
              PPC Service Module
            </h2>
            <p style={{
              fontSize: '16px',
              opacity: 0.7,
              margin: 0,
              color: '#64748b'
            }}>
              New customer acquisition and group join metrics
            </p>
          </div>
          
          <div style={{ padding: '32px' }}>
            {/* KPI Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>
                    NEW CUSTOMER CONVERSION RATE
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    4.83%
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -28.23% vs Last Month
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#f093fb', fontSize: '16px', fontWeight: '600' }}>
                    TOTAL NEW CUSTOMERS
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    65
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -47.58% vs Last Month
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#4facfe', fontSize: '16px', fontWeight: '600' }}>
                    CUSTOMER GROUP JOIN VOLUME
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    1,357
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -26.73% vs Last Month
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Line data={ppcLineData} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Bar data={ppcBarData1} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Bar data={ppcBarData2} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 2: First Depositor */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          marginBottom: '40px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 12px 0',
              color: '#1e293b'
            }}>
              First Depositor Module
            </h2>
            <p style={{
              fontSize: '16px',
              opacity: 0.7,
              margin: 0,
              color: '#64748b'
            }}>
              2nd deposit rates comparison between group and non-group members
            </p>
          </div>
          
          <div style={{ padding: '32px' }}>
            {/* KPI Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>
                    2ND DEPOSIT RATE (IN GROUP)
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    24.22%
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -15.31% vs Last Month
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#f093fb', fontSize: '16px', fontWeight: '600' }}>
                    2ND DEPOSITS (IN GROUP)
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    78
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -51.25% vs Last Month
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#4facfe', fontSize: '16px', fontWeight: '600' }}>
                    2ND DEPOSIT RATE (NOT IN GROUP)
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    11.80%
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -28.53% vs Last Month
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#10b981', fontSize: '16px', fontWeight: '600' }}>
                    2ND DEPOSITS (NOT IN GROUP)
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    65
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -47.58% vs Last Month
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Line data={firstDepositorLineData} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Bar data={firstDepositorBarData1} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Bar data={firstDepositorBarData2} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 3: Old Member */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          marginBottom: '40px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 12px 0',
              color: '#1e293b'
            }}>
              Old Member Module
            </h2>
            <p style={{
              fontSize: '16px',
              opacity: 0.7,
              margin: 0,
              color: '#64748b'
            }}>
              Engagement, NPS, upgrade and churn metrics by tier
            </p>
          </div>
          
          <div style={{ padding: '32px' }}>
            {/* Row 1: 2 StatCard */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>
                    TOTAL UPGRADED MEMBERS
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    188
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -16.27% vs Last Month
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#f093fb', fontSize: '16px', fontWeight: '600' }}>
                    TOTAL CHURNED MEMBERS
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    128
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -12.91% vs Last Month
                  </div>
                </div>
              </div>
            </div>
            
            {/* Row 2: 3 Bar Chart */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '300px'
                }}>
                  <Bar data={oldMemberBarData1} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '300px'
                }}>
                  <Bar data={oldMemberBarData2} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '300px'
                }}>
                  <Bar data={oldMemberBarData3} options={chartOptions} />
                </div>
              </div>
            </div>
            
            {/* Row 3: 2 Line Chart */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '300px'
                }}>
                  <Line data={oldMemberLineData1} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '300px'
                }}>
                  <Line data={oldMemberLineData2} options={chartOptions} />
                </div>
              </div>
            </div>
            
            {/* Row 4: 1 Bar Chart + 1 Line Chart */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Bar data={oldMemberBarData4} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Line data={oldMemberLineData3} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODULE 4: Traffic Executive */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          marginBottom: '40px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: '0 0 12px 0',
              color: '#1e293b'
            }}>
              Traffic Executive Module
            </h2>
            <p style={{
              fontSize: '16px',
              opacity: 0.7,
              margin: 0,
              color: '#64748b'
            }}>
              Customer reactivation and transfer success metrics
            </p>
          </div>
          
          <div style={{ padding: '32px' }}>
            {/* KPI Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#667eea', fontSize: '16px', fontWeight: '600' }}>
                    CUSTOMER TRANSFER SUCCESS RATE
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    80.49%
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -7.27% vs Last Month
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#f093fb', fontSize: '16px', fontWeight: '600' }}>
                    TARGET COMPLETION
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    94.70%
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -5.30% vs Last Month
                  </div>
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#4facfe', fontSize: '16px', fontWeight: '600' }}>
                    TOTAL REACTIVATED CUSTOMERS
                  </h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
                    978
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '14px', fontWeight: '600' }}>
                    ↘️ -23.65% vs Last Month
                  </div>
                </div>
              </div>
            </div>
            
            {/* Charts Section */}
            <div style={{ marginBottom: '40px' }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                gap: '24px' 
              }}>
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Bar data={trafficBarData1} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Bar data={trafficBarData2} options={chartOptions} />
                </div>
                
                <div style={{
                  background: 'white',
                  padding: '32px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e2e8f0',
                  height: '340px'
                }}>
                  <Doughnut data={trafficDonutData} options={donutOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

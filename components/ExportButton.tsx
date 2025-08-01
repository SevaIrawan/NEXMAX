import { useState } from 'react';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  type?: 'csv' | 'json';
}

export default function ExportButton({ 
  data, 
  filename = 'export', 
  type = 'csv' 
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }

    // Convert data to CSV format
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that contain commas by wrapping in quotes
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert('No data available to export');
      return;
    }

    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      if (type === 'csv') {
        exportToCSV(data, filename);
      } else if (type === 'json') {
        exportToJSON(data, filename);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting || !data || data.length === 0}
      style={{
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)',
        opacity: exporting || !data || data.length === 0 ? 0.6 : 1,
        transform: exporting || !data || data.length === 0 ? 'none' : undefined
      }}
      onMouseEnter={(e) => {
        if (!exporting && data && data.length > 0) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!exporting && data && data.length > 0) {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(16, 185, 129, 0.3)';
        }
      }}
    >
      {exporting ? (
        <>
          <span style={{ 
            animation: 'spin 1s linear infinite',
            fontSize: '1.1rem'
          }}>⏳</span>
          Exporting...
        </>
      ) : (
        <>
          <span style={{ fontSize: '1.1rem' }}>📥</span>
          Export {type.toUpperCase()}
        </>
      )}
    </button>
  );
} 
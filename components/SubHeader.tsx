'use client'

interface SubHeaderProps {
  title: string
  year: number
  setYear: (year: number) => void
  currency: string
  setCurrency: (currency: string) => void
  month: number
  setMonth: (month: number) => void
  showMonthSlicer?: boolean
}

// Placeholder components untuk slicers
const CurrencySlicer = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value)}
    style={{
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white'
    }}
  >
    <option value="USD">USD</option>
    <option value="MYR">MYR</option>
    <option value="SGD">SGD</option>
  </select>
)

const YearSlicer = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(Number(e.target.value))}
    style={{
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white'
    }}
  >
    <option value={2023}>2023</option>
    <option value={2024}>2024</option>
    <option value={2025}>2025</option>
  </select>
)

const MonthSlicer = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
  <select 
    value={value} 
    onChange={(e) => onChange(Number(e.target.value))}
    style={{
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white'
    }}
  >
    <option value={1}>January</option>
    <option value={2}>February</option>
    <option value={3}>March</option>
    <option value={4}>April</option>
    <option value={5}>May</option>
    <option value={6}>June</option>
    <option value={7}>July</option>
    <option value={8}>August</option>
    <option value={9}>September</option>
    <option value={10}>October</option>
    <option value={11}>November</option>
    <option value={12}>December</option>
  </select>
)

// IMPROVED SUB HEADER - SAME LAYOUT AS MAIN DASHBOARD
export default function SubHeader({ 
  title, 
  year, setYear, 
  currency, setCurrency, 
  month, setMonth, 
  showMonthSlicer = true
}: SubHeaderProps) {
  return (
    <div className="dashboard-header-fixed">
      <h2 className="dashboard-subtitle">{title}</h2>
      <div className="slicer-controls">
        <div className="filter-group">
          <label>Year:</label>
          <YearSlicer value={year} onChange={setYear} />
        </div>
        <div className="filter-group">
          <label>Currency:</label>
          <CurrencySlicer value={currency} onChange={setCurrency} />
        </div>
        {showMonthSlicer && (
          <div className="filter-group">
            <label>Month:</label>
            <MonthSlicer value={month} onChange={setMonth} />
          </div>
        )}
      </div>
    </div>
  )
} 
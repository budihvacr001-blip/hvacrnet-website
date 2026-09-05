import React from 'react'

interface DataTableProps {
  headers?: string[]
  rows: string[][]
  className?: string
  // For key-value tables (Material & Standard, Technical Parameters)
  keyValue?: boolean
  // Column count for table-fixed layout
  minCols?: number
  // Custom cell renderer
  renderCell?: (cell: string, rowIdx: number, colIdx: number) => React.ReactNode
}

export default function DataTable({ headers, rows, className = '', keyValue = false, minCols, renderCell }: DataTableProps) {
  const colCount = headers?.length || (keyValue ? 2 : (minCols || rows[0]?.length || 1))
  const useFixed = colCount >= 9

  // Determine which columns should keep whitespace-nowrap
  // Only: model code columns, pure numeric columns, size range columns
  const isShortDataCol = (cell: string, colIdx: number): boolean => {
    // First column (product name) always allows wrap
    if (colIdx === 0) return false
    // Pure numeric
    if (/^[\d.,\s~\-–]+%?$/.test(cell)) return true
    // Size ranges like 3/8"~3-1/8", 1/4"–1-1/8"
    if (/^[\d/"]+[\s~\-–]+[\d/"]+$/.test(cell)) return true
    // Model codes like DQF, HBC, QF-CO2, BFK-083, SGN-1/4
    if (/^[A-Z]{1,4}[\d\-/]*$/.test(cell)) return true
    // Short specs like "45 bar", "120 bar", "NC", "NO", "ODF", "SAE"
    if (/^[\d]+\s*(bar|mm|kg|W|V|A|Hz|°C|°F)$/.test(cell)) return true
    if (/^(NC|NO|ODF|SAE|NPT|BSPP|UNF|IP\d+|Yes|No)$/i.test(cell)) return true
    return false
  }

  if (keyValue) {
    return (
      <div className={`overflow-hidden rounded-lg border border-gray-border ${className}`}>
        <table className="w-full text-xs md:text-[13px] border-collapse">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-gray-bg' : 'bg-white'}>
                <td className="px-2.5 py-2 font-medium text-navy w-1/3 align-top">{row[0]}</td>
                <td className="px-2.5 py-2 text-gray-700 align-top">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto md:overflow-visible rounded-lg border border-gray-border ${className}`}>
      <table className={`w-full text-xs md:text-[13px] border-collapse ${useFixed ? 'table-fixed' : ''} min-w-[640px] md:min-w-0`}>
        {useFixed && colCount >= 9 && (
          <colgroup>
            <col style={{ width: '22%' }} />
            {Array.from({ length: colCount - 2 }).map((_, i) => (
              <col key={i} style={{ width: `${14}%` }} />
            ))}
            <col style={{ width: '14%' }} />
          </colgroup>
        )}
        {headers && (
          <thead>
            <tr className="bg-navy text-white">
              {headers.map((h, i) => (
                <th key={i} className="px-2.5 py-2 text-left font-semibold align-top">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, cellIdx) => {
                const nowrap = isShortDataCol(cell, cellIdx)
                const isFirstCol = cellIdx === 0
                return (
                  <td
                    key={cellIdx}
                    className={`px-2.5 py-2 align-top ${
                      isFirstCol ? 'min-w-[160px] font-medium' : ''
                    } ${nowrap ? 'whitespace-nowrap' : ''} ${
                      isFirstCol ? 'sticky left-0 z-10 md:static shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] md:shadow-none' : ''
                    } ${rowIdx % 2 === 0 ? (isFirstCol ? 'bg-white' : '') : (isFirstCol ? 'bg-gray-50' : '')}`}
                  >
                    {renderCell ? renderCell(cell, rowIdx, cellIdx) : cell}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

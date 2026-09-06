import React from 'react'

interface DataTableProps {
  headers?: string[]
  rows: string[][]
  className?: string
  // For key-value tables (Material & Standard, Technical Parameters)
  keyValue?: boolean
  // Column index that should be sticky on mobile (default: 0)
  stickyColIdx?: number
  // Custom cell renderer
  renderCell?: (cell: string, rowIdx: number, colIdx: number) => React.ReactNode
}

export default function DataTable({ headers, rows, className = '', keyValue = false, stickyColIdx = 0, renderCell }: DataTableProps) {
  const colCount = headers?.length || (keyValue ? 2 : (rows[0]?.length || 1))

  // Calculate column widths for table-fixed layout (for tables with many columns)
  const getColumnWidths = (): string[] => {
    if (colCount < 6) return []
    
    const widths: string[] = []
    
    // Check if first column is "#" (row number)
    const hasRowNumber = headers?.[0] === '#'
    
    if (hasRowNumber) {
      widths.push('4%') // # column
      
      // Product name column (index 1)
      if (colCount <= 7) {
        widths.push('28%')
      } else if (colCount <= 9) {
        widths.push('22%')
      } else {
        widths.push('18%')
      }
      
      // Remaining columns
      const remainingCols = colCount - 2
      const remainingWidth = 100 - 4 - (colCount <= 7 ? 28 : colCount <= 9 ? 22 : 18)
      
      for (let i = 0; i < remainingCols; i++) {
        // Last column (Models) gets slightly less width
        if (i === remainingCols - 1 && headers?.[colCount - 1]?.toLowerCase().includes('model')) {
          widths.push('6%')
        } else {
          widths.push(`${Math.floor(remainingWidth / remainingCols)}%`)
        }
      }
    } else {
      // No row number column
      // Product name column (index 0)
      if (colCount <= 6) {
        widths.push('30%')
      } else if (colCount <= 8) {
        widths.push('24%')
      } else {
        widths.push('20%')
      }
      
      // Remaining columns
      const remainingCols = colCount - 1
      const remainingWidth = 100 - (colCount <= 6 ? 30 : colCount <= 8 ? 24 : 20)
      
      for (let i = 0; i < remainingCols; i++) {
        widths.push(`${Math.floor(remainingWidth / remainingCols)}%`)
      }
    }
    
    // Adjust to ensure total is exactly 100%
    const total = widths.reduce((sum, w) => sum + parseFloat(w), 0)
    if (total !== 100 && widths.length > 0) {
      const diff = 100 - total
      const lastIdx = widths.length - 1
      const lastWidth = parseFloat(widths[lastIdx])
      widths[lastIdx] = `${lastWidth + diff}%`
    }
    
    return widths
  }

  const columnWidths = getColumnWidths()
  const useFixed = columnWidths.length > 0

  // Determine which columns should keep whitespace-nowrap
  const isShortDataCol = (cell: string, colIdx: number): boolean => {
    // Row number column
    if (headers?.[colIdx] === '#') return true
    // Sticky column (product name) always allows wrap
    if (colIdx === stickyColIdx) return false
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
    <div className={`overflow-x-auto rounded-lg border border-gray-border ${className}`}>
      <table className={`w-full text-xs md:text-[13px] border-collapse ${useFixed ? 'table-fixed' : ''} min-w-[640px] md:min-w-0`}>
        {useFixed && (
          <colgroup>
            {columnWidths.map((width, i) => (
              <col key={i} style={{ width }} />
            ))}
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
                const isStickyCol = cellIdx === stickyColIdx
                const rowBgClass = rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                return (
                  <td
                    key={cellIdx}
                    className={`px-2.5 py-2 align-top ${
                      isStickyCol ? 'font-medium' : ''
                    } ${nowrap ? 'whitespace-nowrap' : 'whitespace-normal'} ${
                      isStickyCol ? 'sticky left-0 z-10 md:static shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] md:shadow-none' : ''
                    } ${isStickyCol ? rowBgClass : ''}`}
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

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

// Long content column keywords (case-insensitive match)
const LONG_CONTENT_KEYWORDS = ['voltage', 'connection', 'structure', 'refrigerant']

// Check if a header matches a column role
const getColRole = (header: string | undefined): 'number' | 'product' | 'models' | 'long' | 'default' => {
  if (!header) return 'default'
  const h = header.toLowerCase().trim()
  if (h === '#') return 'number'
  if (h === 'product') return 'product'
  if (h.includes('model')) return 'models'
  if (LONG_CONTENT_KEYWORDS.some(kw => h.includes(kw))) return 'long'
  return 'default'
}

// Atomize text: split into non-breakable atoms separated by breakable delimiters
// Atoms (words, numbers, -40~120°C, DC12V, etc.) stay intact; breaks only at spaces, commas, slashes
// Temperature units °C/°F are merged with the preceding atom
const atomizeText = (text: string): React.ReactNode => {
  if (!text) return null
  
  const str = String(text)
  
  // Split by delimiters (spaces, commas, slashes) while keeping the delimiters
  const parts = str.split(/([\s,/]+)/)
  
  if (parts.length === 0) return str
  if (parts.length === 1) {
    // Single atom, check for temperature unit
    const atom = parts[0]
    return <span className="whitespace-nowrap">{atom}</span>
  }
  
  // Build atoms with delimiters between them
  const result: React.ReactNode[] = []
  let currentAtom = ''
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    
    // Check if this is a delimiter (space, comma, slash)
    const isDelimiter = /^[\s,/]+$/.test(part)
    
    if (isDelimiter) {
      // Finish current atom if any
      if (currentAtom) {
        result.push(
          <span key={`atom-${result.length}`} className="whitespace-nowrap">
            {currentAtom}
          </span>
        )
        currentAtom = ''
      }
      // Add delimiter with <wbr> for break opportunity
      result.push(<span key={`delim-${result.length}`} className="break-normal">{part}<wbr/></span>)
    } else {
      // Check if this is a temperature unit (°C, °F, ºC, ºF)
      const isTempUnit = /^[°º]\s*[CFcf]$/.test(part)
      
      if (isTempUnit && currentAtom) {
        // Merge temperature unit with current atom (no space between)
        currentAtom += part
      } else if (isTempUnit && result.length > 0) {
        // Temperature unit without preceding atom, merge with previous atom
        // Find the last atom span and append to it
        const lastIdx = result.length - 1
        const lastElement = result[lastIdx]
        if (React.isValidElement(lastElement)) {
          const props = lastElement.props as { className?: string; children?: React.ReactNode }
          if (props.className?.includes('whitespace-nowrap')) {
            // Merge with previous atom
            const prevContent = props.children
            result[lastIdx] = (
              <span key={`atom-${lastIdx}`} className="whitespace-nowrap">
                {prevContent}{part}
              </span>
            )
          } else {
            // Previous element is a delimiter, start new atom
            currentAtom = part
          }
        } else {
          // Previous element is a delimiter, start new atom
          currentAtom = part
        }
      } else {
        // Regular atom part
        currentAtom += part
      }
    }
  }
  
  // Push any remaining atom
  if (currentAtom) {
    result.push(
      <span key={`atom-${result.length}`} className="whitespace-nowrap">
        {currentAtom}
      </span>
    )
  }
  
  return <>{result}</>
}

// Process React node to atomize text content
const atomizeNode = (node: React.ReactNode): React.ReactNode => {
  if (typeof node === 'string') {
    return atomizeText(node)
  }
  if (React.isValidElement(node)) {
    const children = (node as React.ReactElement<{ children?: React.ReactNode }>).props.children
    if (typeof children === 'string') {
      return React.cloneElement(node as React.ReactElement<{ children?: React.ReactNode }>, {}, atomizeText(children))
    }
  }
  return node
}

export default function DataTable({ headers, rows, className = '', keyValue = false, stickyColIdx = 0, renderCell }: DataTableProps) {
  const colCount = headers?.length || (keyValue ? 2 : (rows[0]?.length || 1))

  // Calculate column widths by column role (sum must = 100%)
  const getColumnWidths = (): string[] => {
    if (colCount < 6 || !headers) return []

    const roles = headers.map(h => getColRole(h))
    const widths: number[] = new Array(colCount).fill(0)

    // Fixed width columns
    const WIDTHS = {
      number: 4,
      product: 18,
      models: 8,
      long: 9,
    }

    // First pass: assign fixed widths
    let usedWidth = 0
    let defaultColCount = 0

    roles.forEach((role, i) => {
      if (role === 'number') {
        widths[i] = WIDTHS.number
        usedWidth += WIDTHS.number
      } else if (role === 'product') {
        widths[i] = WIDTHS.product
        usedWidth += WIDTHS.product
      } else if (role === 'models') {
        widths[i] = WIDTHS.models
        usedWidth += WIDTHS.models
      } else if (role === 'long') {
        widths[i] = WIDTHS.long
        usedWidth += WIDTHS.long
      } else {
        defaultColCount++
      }
    })

    // Second pass: distribute remaining width to default columns
    const remainingWidth = 100 - usedWidth
    if (defaultColCount > 0) {
      const defaultWidth = Math.floor(remainingWidth / defaultColCount)
      let distributedWidth = 0

      roles.forEach((role, i) => {
        if (role === 'default') {
          widths[i] = defaultWidth
          distributedWidth += defaultWidth
        }
      })

      // Add remainder to last default column
      const remainder = remainingWidth - distributedWidth
      if (remainder !== 0) {
        const lastDefaultIdx = roles.lastIndexOf('default')
        if (lastDefaultIdx >= 0) {
          widths[lastDefaultIdx] += remainder
        }
      }
    } else {
      // No default columns, adjust last column to make sum = 100
      const currentSum = widths.reduce((a, b) => a + b, 0)
      if (currentSum !== 100 && colCount > 0) {
        widths[colCount - 1] += (100 - currentSum)
      }
    }

    return widths.map(w => `${w}%`)
  }

  const columnWidths = getColumnWidths()
  const useFixed = columnWidths.length > 0

  // Determine which columns should keep whitespace-nowrap (short data only)
  const isShortDataCol = (cell: string, colIdx: number): boolean => {
    // Row number column
    if (headers?.[colIdx] === '#') return true
    // Sticky column (product name) always allows wrap
    if (colIdx === stickyColIdx) return false
    // Check column role - models and number columns are always nowrap
    const role = getColRole(headers?.[colIdx])
    if (role === 'number' || role === 'models') return true
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
        <table className="w-full text-[10.5px] md:text-[11.5px] border-collapse">
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-gray-bg' : 'bg-white'}>
                <td className="px-1.5 py-1.5 font-medium text-navy w-1/3 align-top leading-tight overflow-hidden">{atomizeText(row[0])}</td>
                <td className="px-1.5 py-1.5 text-gray-700 align-top leading-tight whitespace-normal break-normal overflow-hidden">{atomizeText(row[1])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto rounded-lg border border-gray-border ${className}`}>
      <table className={`w-full text-[10.5px] md:text-[11.5px] border-collapse ${useFixed ? 'table-fixed' : ''} min-w-[1024px]`}>
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
                <th key={i} className="px-2 py-1.5 text-left font-semibold align-top leading-tight whitespace-normal break-normal overflow-hidden">
                  {atomizeText(h)}
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
                // Check if cell content is long (>14 chars) for font size reduction
                const isLongContent = !nowrap && cell.length > 14
                const cellContent = renderCell ? renderCell(cell, rowIdx, cellIdx) : atomizeText(cell)
                return (
                  <td
                    key={cellIdx}
                    className={`px-2 py-1.5 align-top overflow-hidden ${
                      isStickyCol ? 'font-medium' : ''
                    } ${nowrap ? 'whitespace-nowrap' : 'whitespace-normal break-normal leading-tight'} ${
                      isLongContent ? 'text-[9.5px] md:text-[10.5px]' : ''
                    } ${
                      isStickyCol ? `sticky left-0 z-10 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.1)] ${rowBgClass}` : ''
                    }`}
                  >
                    {renderCell && React.isValidElement(cellContent) ? atomizeNode(cellContent) : cellContent}
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

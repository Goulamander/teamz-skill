import React, { Fragment } from 'react'
import { useTable, usePagination } from 'react-table'

const DataTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    pageOptions,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  )

  return (
    <Fragment>
      <table {...getTableProps()} className={'full-width'}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <span class="fa fa-cart-down"></span>
                        : <span class="fa fa-cart-up"></span>
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="table-content-analytics">
                  {row.cells.map((cell, index) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
      <br />
      <div className="pagination-container">
        <div className="pagination-text">Showing {page.length} of {rows.length} entries</div>
        <div className="pagination page-item">
          {/* <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '} */}
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="page-link">
            {'Previous'}
          </button>{' '}
          <strong className="page-link">
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage} className="page-link">
            {'Next'}
          </button>{' '}
          {/* <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '} */}
        </div>
      </div>
    </Fragment>
  )
}

export default DataTable

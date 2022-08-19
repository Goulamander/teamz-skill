import React, { Fragment, useEffect } from 'react'
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table'
import classnames from 'classnames'
import { checkRowSelected } from '../transforms'

const SelectTable = ({ columns, data, handleExpandClick, onMassSelection, selectedRowIndex, roleChange, deleteMember, selectedTeam, getFlatedRows }) => {
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
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      handleExpandClick,
      onMassSelection,
      deleteMember,
      roleChange,
      selectedTeam
    },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => {
        return [
          ...columns,
        ]
      })
    }
  )

  useEffect(() => {
    if(getFlatedRows)
    getFlatedRows(selectedFlatRows)
  }, [selectedFlatRows])

  return (
    <Fragment>
      <table {...getTableProps()} className={'full-width'}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="table-header-analytics">
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? <span className="fa fa-caret-down"></span>
                        : <span className="fa fa-caret-up"></span>
                      : column.disableSortBy? '': <span className="fa fa-caret-down disable"></span>}
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
                <tr {...row.getRowProps()} className={classnames({"table-content-analytics": true, "selected-row": (row.index === selectedRowIndex || selectedRowIds[row.index] === true) })}>
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

export default SelectTable

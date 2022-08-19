import React, { Fragment, useEffect } from 'react'
import { useTable, usePagination, useSortBy, useRowSelect, useResizeColumns, useBlockLayout } from 'react-table'
import classnames from 'classnames'

const SfSelectTable = ({ columns, data, anSort, handleExpandClick, onMassSelection, selectedRowIndex, roleChange, deleteMember, selectedTeam, onSort }) => {
  
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 70,
      width: 120,
      maxWidth: 300,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    state: { pageIndex, pageSize, selectedRowIds, sortBy, selectedFlatRows },
  } = useTable(
    {
      columns,
      data,
      manualSorting: true,
      initialState: { pageIndex: 0, sortBy: [
        {
          id: 'first_login',
          desc: false
        }
      ] },
      handleExpandClick,
      onMassSelection,
      deleteMember,
      roleChange,
      selectedTeam,

    },
    useSortBy,
    usePagination,
    useRowSelect,
    useResizeColumns,
    hooks => {
      hooks.visibleColumns.push(columns => {
        return [
          ...columns,
        ]
      })
    }
  );

  useEffect(() => {
    if(onSort)
    onSort(sortBy)
  }, [sortBy]);

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
                  {column.canResize && (
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? 'isResizing' : ''
                    }`}
                  />
                )}
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
    </Fragment>
  )
}

export default SfSelectTable
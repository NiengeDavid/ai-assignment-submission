"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { Input } from "./ui/input";

// Static data for the table
const staticData = [
  {
    id: 1,
    studentId: "ST001",
    studentName: "John Doe",
    course: "Mathematics",
    department: "Science",
    level: "100",
    status: "Done",
  },
  {
    id: 2,
    studentId: "ST002",
    studentName: "Jane Smith",
    course: "Physics",
    department: "Science",
    level: "200",
    status: "In Progress",
  },
  {
    id: 3,
    studentId: "ST003",
    studentName: "Emily Johnson",
    course: "Chemistry",
    department: "Science",
    level: "300",
    status: "Not Started",
  },
  {
    id: 4,
    studentId: "ST004",
    studentName: "Michael Brown",
    course: "Biology",
    department: "Science",
    level: "400",
    status: "Done",
  },
  {
    id: 5,
    studentId: "ST005",
    studentName: "Sarah Davis",
    course: "Computer Science",
    department: "Engineering",
    level: "500",
    status: "In Progress",
  },
];

// Table columns
const columns: ColumnDef<(typeof staticData)[0]>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => (
      <Input
        type="checkbox"
        onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
        checked={table.getIsAllRowsSelected()}
        className="cursor-pointer border border-bg2 rounded-md bg-transparent h-4 w-4 md:h-3 md:w-3 lg:h-3 lg:w-3"
      />
    ),
    cell: ({ row }) => (
      <Input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        className="cursor-pointer border border-bg2 rounded-md bg-transparent h-4 w-4 md:h-3 md:w-3 lg:h-3 lg:w-3"
      />
    ),
  },
  {
    accessorKey: "studentId",
    header: "STUDENT ID",
    cell: ({ row }) => <span>{row.original.studentId}</span>,
  },
  {
    accessorKey: "studentName",
    header: "STUDENT NAME",
    cell: ({ row }) => <span>{row.original.studentName}</span>,
  },
  {
    accessorKey: "course",
    header: "COURSE",
    cell: ({ row }) => <span>{row.original.course}</span>,
  },
  {
    accessorKey: "department",
    header: "DEPARTMENT",
    cell: ({ row }) => <span>{row.original.department}</span>,
  },
  {
    accessorKey: "level",
    header: "LEVEL",
    cell: ({ row }) => <span>{row.original.level}</span>,
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.status === "Done" ? (
          <span className="text-green-500">{row.original.status}</span>
        ) : row.original.status === "In Progress" ? (
          <span className="text-yellow-500">{row.original.status}</span>
        ) : (
          <span className="text-red-500">{row.original.status}</span>
        )}
      </Badge>
    ),
  },
  {
    accessorKey: "actions",
    header: "",
    cell: ({ row }) => (
      <a
        href="link"
        className="text-blue-500"
        onClick={() => alert(`Viewing details for ${row.original.studentName}`)}
      >
        View Details
      </a>
    ),
  },
];

export function DataTable() {
  const [data, setData] = React.useState(() => staticData);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full flex flex-col gap-4 bg-white dark:bg-bg2 rounded-lg p-4 lg:py-10">
      <div className="overflow-hidden dark:bg-bg2">
        <Table>
          <TableHeader className="dark:bg-bg2">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          Showing {table.getRowModel().rows.length} of {data.length} row(s)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

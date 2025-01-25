'use client';

import { useState, useEffect } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { userUpdatesSubscription } from '@/lib/actioncable';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  synced_at?: string;
}

export default function StatusPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (userUpdatesSubscription) {
      const originalHandler = userUpdatesSubscription.received;
      
      userUpdatesSubscription.received = (data: {
        type: string;
        user: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          date_of_birth: string;
          synced_at?: string;
          [key: string]: unknown;
        };
      }) => {
        // Call the original handler first
        if (originalHandler) {
          originalHandler(data);
        }
        
        console.log('Status Page received update:', {
          type: data.type,
          data: data,
          timestamp: new Date().toISOString()
        });
        
        if (data.type === 'sync_status_update') {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === data.user.id ? { ...user, synced_at: data.user.synced_at } : user
            )
          );
        } else if (data.type === 'new_user') {
          // Ensure the new user has all required fields before adding
          const newUser: User = {
            id: data.user.id,
            first_name: data.user.first_name,
            last_name: data.user.last_name,
            email: data.user.email,
            date_of_birth: data.user.date_of_birth,
            synced_at: data.user.synced_at,
          };
          setUsers((prevUsers) => [newUser, ...prevUsers]);
        }
      };

      return () => {
        // Restore the original handler on cleanup
        if (userUpdatesSubscription) {
          userUpdatesSubscription.received = originalHandler;
        }
      };
    }
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'email',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Email
            <ArrowUpDown />
          </Button>
        );
      },
    },
    {
      accessorKey: 'date_of_birth',
      header: 'Date of Birth',
    },
    {
      accessorKey: 'synced_at',
      header: 'Synced At',
      cell: ({ row }) => {
        const synced_at = row.getValue('synced_at');
        if (!synced_at) return '-';
        
        return new Date(synced_at as string).toLocaleString('en-AU', {
          dateStyle: 'medium',
          timeStyle: 'medium',
          timeZone: 'Australia/Sydney'
        });
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">User Status</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('email')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
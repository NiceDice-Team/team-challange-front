import { Eye } from "lucide-react";
import CustomBadge from "../shared/CustomBadge";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";
import { BadgeProps } from "../ui/badge";

const formatItemsCount = (count: number): string => {
  if (count === 1) {
    return "1 item";
  }
  return `${count} items`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const orders = [
  {
    id: 12345674,
    date: "2021-01-01",
    total: 112.0,
    status: "Delivered",
    items: 2,
  },
  {
    id: 12345600,
    date: "2021-01-01",
    total: 56.0,
    status: "Shipped",
    items: 1,
  },
  {
    id: 10045674,
    date: "2021-01-01",
    total: 230,
    status: "Processing",
    items: 3,
  },
];

const mappingStatusesToVariant: Record<string, BadgeProps["variant"]> = {
  Delivered: "default",
  Shipped: "secondary",
  Processing: "outline",
};

function OrdersTable() {
  return (
    <Table>
      <TableHeader className="mb-6 border-none">
        <TableRow className="text-dark-gray uppercase">
          <TableHead className="w-[155px]">ORDER ID</TableHead>
          <TableHead>DATE</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead>ITEMS</TableHead>
          <TableHead>TOTAL</TableHead>
          <TableHead className="text-right">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border-none text-black">
        {orders.map((order) => (
          <TableRow key={order.id} className="py-4">
            <TableCell className="py-4">{order.id}</TableCell>
            <TableCell>{formatDate(order.date)}</TableCell>
            <TableCell>
              <CustomBadge variant={mappingStatusesToVariant[order.status]}>
                {order.status}
              </CustomBadge>
            </TableCell>
            <TableCell>{formatItemsCount(order.items)}</TableCell>
            <TableCell>${order.total.toFixed(2)}</TableCell>
            <TableCell className="flex justify-end items-center gap-2 h-[53px] text-right">
              <Eye size={20} /> View
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrdersTable;

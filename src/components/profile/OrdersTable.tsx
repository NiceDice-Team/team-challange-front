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
import { useUserStore } from "@/store/user";
import { useOrdersQuery } from "@/hooks/useOrdersQuery";
import { Order } from "@/lib/definitions";

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

const mappingStatusesToVariant: Record<string, BadgeProps["variant"]> = {
  delivered: "default",
  shipped: "secondary",
  processing: "outline",
  pending: "destructive",
  cancelled: "destructive",
};

function OrdersTable() {
  const { userData } = useUserStore();
  const userId = userData?.id;

  const { data: orders = [], isLoading, error } = useOrdersQuery(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-500">
          Error loading orders: {error.message}
        </div>
      </div>
    );
  }

  if (!orders || orders?.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">No orders found</div>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="mb-6 border-none">
        <TableRow className="text-dark-gray uppercase">
          <TableHead className="w-[155px]">ORDER ID</TableHead>
          <TableHead>DATE</TableHead>
          <TableHead>STATUS</TableHead>
          <TableHead className="hidden md:block">ITEMS</TableHead>
          <TableHead className="hidden md:block">TOTAL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border-none text-black">
        {orders.map((order: Order) => (
          <TableRow key={order.id} className="py-4">
            <TableCell className="py-4">{order.id}</TableCell>
            <TableCell>{formatDate(order.created_at)}</TableCell>
            <TableCell>
              <CustomBadge variant={mappingStatusesToVariant[order.status]}>
                {order?.status?.charAt(0).toUpperCase() +
                  order?.status?.slice(1)}
              </CustomBadge>
            </TableCell>
            <TableCell className="hidden md:block">{formatItemsCount(order?.products?.length)}</TableCell>
            <TableCell className="hidden md:block">${Number(order?.total_amount)?.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrdersTable;

import {
  Table,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "../ui/table";

const orders = [
  {
    id: 1,
    date: "2021-01-01",
    total: 112.0,
    status: "Delivered",
    items: 2,
  },
  {
    id: 2,
    date: "2021-01-01",
    total: 56.0,
    status: "Shipped",
    items: 1,
  },
  {
    id: 3,
    date: "2021-01-01",
    total: 230,
    status: "Processing",
    items: 3,
  },
];
function OrdersTable() {
  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
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
            <TableCell className="py-4 font-medium">{order.id}</TableCell>
            <TableCell>{order.date}</TableCell>
            <TableCell>{order.status}</TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell>{order.total}</TableCell>
            <TableCell className="text-right">View</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default OrdersTable;

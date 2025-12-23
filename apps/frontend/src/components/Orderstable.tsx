function StatusBadge({ status }: { status: string }) {
  if (status === "PENDING") {
    return (
      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 animate-pulse">
        Pending
      </span>
    );
  }

  if (status === "FILLED") {
    return (
      <span className="px-2 py-1 rounded bg-green-100 text-green-800 transition-all duration-500">
        Filled
      </span>
    );
  }

  if (status === "REJECTED") {
    return (
      <span className="px-2 py-1 rounded bg-red-100 text-red-800">
        Rejected
      </span>
    );
  }

  return status;
}

export default function OrdersTable({ orders }: { orders: any[] }) {
  if (!orders.length) {
    return <p className="text-gray-500 mt-4">No orders placed yet</p>;
  }

  return (
    <table className="w-full border mt-4 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th>Time</th>
          <th>Symbol</th>
          <th>Side</th>
          <th>Type</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.orderId} className="border-b text-center">
            <td>{new Date().toLocaleTimeString()}</td>
            <td>{o.symbol}</td>
            <td className={o.side === "BUY" ? "text-green-600" : "text-red-600"}>
              {o.side}
            </td>
            <td>{o.type}</td>
            <td>{o.quantity}</td>
            <td>{o.price ?? "Market"}</td>
            <td>
              <StatusBadge status={o.status} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import OrderRow, { SerializableOrder } from "./OrderRow";

interface OrderTableProps {
  title: string;
  orders: SerializableOrder[];
}

export default function OrderTable({ title, orders }: OrderTableProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      {orders.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-gray-500">
            No {title.toLowerCase()} orders at the moment.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

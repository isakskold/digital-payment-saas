"use client";

import { useTransition } from "react";
import { confirmOrder } from "../../actions";

interface AcceptOrderButtonProps {
  orderId: string;
}

export default function AcceptOrderButton({ orderId }: AcceptOrderButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    startTransition(async () => {
      await confirmOrder(orderId);
    });
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleAccept();
      }}
      disabled={isPending}
      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
    >
      {isPending ? "Accepterar..." : "Acceptera"}
    </button>
  );
}

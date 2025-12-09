import { Badge } from "@/components/ui/badge";
import { DetractorTicket, TicketStatus } from "@/lib/types";
import { format } from "date-fns";

interface DetractorCasesTableProps {
  tickets: DetractorTicket[];
}

const statusConfig: Record<TicketStatus, { className: string }> = {
  Open: { className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400" },
  "In Progress": { className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400" },
  Resolved: { className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400" },
};

export default function DetractorCasesTable({ tickets }: DetractorCasesTableProps) {
  if (tickets.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No detractor cases recorded
      </p>
    );
  }

  return (
    <div className="overflow-x-auto" data-testid="table-detractor-cases">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-2 font-medium text-muted-foreground">Customer</th>
            <th className="text-left py-2 px-2 font-medium text-muted-foreground">Issue</th>
            <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-2 px-2 font-medium text-muted-foreground">Action Taken</th>
            <th className="text-left py-2 px-2 font-medium text-muted-foreground">Date</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr 
              key={ticket.id} 
              className="border-b border-border last:border-0"
              data-testid={`row-ticket-${ticket.id}`}
            >
              <td className="py-3 px-2 font-medium">{ticket.customerName}</td>
              <td className="py-3 px-2 text-muted-foreground max-w-[200px] truncate">
                {ticket.issue}
              </td>
              <td className="py-3 px-2">
                <Badge className={statusConfig[ticket.status].className} variant="outline">
                  {ticket.status}
                </Badge>
              </td>
              <td className="py-3 px-2 text-muted-foreground max-w-[200px] truncate">
                {ticket.actionTaken}
              </td>
              <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                {format(new Date(ticket.createdAt), "MMM d, yyyy")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

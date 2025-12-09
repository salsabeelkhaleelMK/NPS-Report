import DetractorCasesTable from '../campaigns/DetractorCasesTable';
import { DetractorTicket } from '@/lib/types';

// todo: remove mock functionality
const mockTickets: DetractorTicket[] = [
  { id: "dt1", customerName: "Michael Schmidt", issue: "Long wait times at service desk", status: "In Progress", actionTaken: "Manager follow-up scheduled", createdAt: new Date() },
  { id: "dt2", customerName: "Emma Weber", issue: "Vehicle delivery delayed", status: "Resolved", actionTaken: "Compensation offered and accepted", createdAt: new Date() },
  { id: "dt3", customerName: "Thomas Müller", issue: "Unsatisfied with financing terms", status: "Open", actionTaken: "Pending review", createdAt: new Date() },
];

export default function DetractorCasesTableExample() {
  return <DetractorCasesTable tickets={mockTickets} />;
}

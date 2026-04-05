import { People, Add } from "@mui/icons-material";

export const hrMenu = [
  {
    name: "Employees",
    icon: <People fontSize="small" />,
    children: [
      { name: "All Employees", link: "/hr/employees" },
      { name: "Attendance", link: "/hr/attendance" },
    ],
  },
  {
    name: "Leave Requests",
    icon: <Add fontSize="small" />,
    children: [
      { name: "Pending Requests", link: "/hr/leave/pending" },
      { name: "Approved Requests", link: "/hr/leave/approved" },
    ],
  },
];
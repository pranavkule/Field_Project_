export const SAMPLE_CHILDREN = [
  { id: 1, name: "Aarav Sharma", age: 8, gender: "Male", dob: "2016-03-12", admissionDate: "2022-01-15", grade: "3rd", guardian: "None", status: "Active", healthStatus: "Good", photo: "AS" },
  { id: 2, name: "Priya Patel", age: 11, gender: "Female", dob: "2013-07-22", admissionDate: "2021-06-10", grade: "6th", guardian: "Ravi Patel (Uncle)", status: "Active", healthStatus: "Good", photo: "PP" },
  { id: 3, name: "Rohan Verma", age: 9, gender: "Male", dob: "2015-11-05", admissionDate: "2023-03-20", grade: "4th", guardian: "None", status: "Active", healthStatus: "Under Observation", photo: "RV" },
  { id: 4, name: "Sneha Rao", age: 12, gender: "Female", dob: "2012-02-18", admissionDate: "2020-09-01", grade: "7th", guardian: "Meena Rao (Aunt)", status: "Active", healthStatus: "Good", photo: "SR" },
  { id: 5, name: "Karan Singh", age: 7, gender: "Male", dob: "2017-08-30", admissionDate: "2023-11-12", grade: "2nd", guardian: "None", status: "Active", healthStatus: "Good", photo: "KS" },
  { id: 6, name: "Ananya Joshi", age: 14, gender: "Female", dob: "2010-05-14", admissionDate: "2019-04-05", grade: "9th", guardian: "None", status: "Active", healthStatus: "Good", photo: "AJ" },
];

export const SAMPLE_STAFF = [
  { id: 1, name: "Sunita Desai", role: "Caretaker", dept: "Child Care", phone: "+91 98765 43210", email: "sunita@caresync.org", joinDate: "2019-03-01", status: "Active", shift: "Morning", photo: "SD" },
  { id: 2, name: "Ramesh Gupta", role: "Teacher", dept: "Education", phone: "+91 87654 32109", email: "ramesh@caresync.org", joinDate: "2020-06-15", status: "Active", shift: "Morning", photo: "RG" },
  { id: 3, name: "Kavita Nair", role: "Nurse", dept: "Health", phone: "+91 76543 21098", email: "kavita@caresync.org", joinDate: "2021-01-10", status: "Active", shift: "Evening", photo: "KN" },
  { id: 4, name: "Amit Tiwari", role: "Cook", dept: "Kitchen", phone: "+91 65432 10987", email: "amit@caresync.org", joinDate: "2018-07-20", status: "Active", shift: "Morning", photo: "AT" },
  { id: 5, name: "Pooja Mehta", role: "Counselor", dept: "Welfare", phone: "+91 54321 09876", email: "pooja@caresync.org", joinDate: "2022-09-05", status: "Active", shift: "Morning", photo: "PM" },
];

export const SAMPLE_HEALTH = [
  { id: 1, childName: "Rohan Verma", date: "2024-03-15", type: "Routine Checkup", doctor: "Dr. Kavita Nair", notes: "Mild fever, prescribed paracetamol", status: "Resolved", followUp: "2024-03-22" },
  { id: 2, childName: "Aarav Sharma", date: "2024-03-10", type: "Vaccination", doctor: "Dr. Patel", notes: "MMR booster administered", status: "Completed", followUp: "None" },
  { id: 3, childName: "Priya Patel", date: "2024-03-08", type: "Dental Checkup", doctor: "Dr. Mehta", notes: "Cavity in lower molar, scheduled treatment", status: "Pending Treatment", followUp: "2024-03-25" },
  { id: 4, childName: "Sneha Rao", date: "2024-03-05", type: "Eye Test", doctor: "Dr. Singh", notes: "Slight myopia, prescribed glasses", status: "Resolved", followUp: "2024-06-05" },
];

export const SAMPLE_INVENTORY = [
  { id: 1, item: "School Uniforms", category: "Clothing", quantity: 45, unit: "Sets", minStock: 20, status: "Adequate", lastUpdated: "2024-03-01" },
  { id: 2, item: "Bedsheets", category: "Bedding", quantity: 30, unit: "Pieces", minStock: 25, status: "Adequate", lastUpdated: "2024-02-20" },
  { id: 3, item: "Notebooks", category: "Stationery", quantity: 8, unit: "Dozens", minStock: 10, status: "Low Stock", lastUpdated: "2024-03-10" },
  { id: 4, item: "Rice", category: "Food", quantity: 50, unit: "Kg", minStock: 30, status: "Adequate", lastUpdated: "2024-03-12" },
  { id: 5, item: "Toothbrushes", category: "Hygiene", quantity: 5, unit: "Pieces", minStock: 20, status: "Critical", lastUpdated: "2024-03-14" },
  { id: 6, item: "Medicines (General)", category: "Medical", quantity: 1, unit: "Kit", minStock: 3, status: "Critical", lastUpdated: "2024-03-05" },
];

export const SAMPLE_NEEDS = [
  { id: 1, item: "Winter Jackets", category: "Clothing", quantity: 20, priority: "High", requestedBy: "Sunita Desai", dateRequested: "2024-03-10", status: "Pending" },
  { id: 2, item: "Science Lab Kits", category: "Education", quantity: 5, priority: "Medium", requestedBy: "Ramesh Gupta", dateRequested: "2024-03-08", status: "Approved" },
  { id: 3, item: "First Aid Kits", category: "Medical", quantity: 3, priority: "High", requestedBy: "Kavita Nair", dateRequested: "2024-03-12", status: "Pending" },
];

export const SAMPLE_EXPENSES = [
  { id: 1, date: "2024-03-15", description: "Monthly Grocery Purchase", category: "Food", amount: 18500, paymentMode: "Bank Transfer", approvedBy: "Admin", receipt: "RCP-001" },
  { id: 2, date: "2024-03-14", description: "Utility Bills (Electricity & Water)", category: "Utilities", amount: 7200, paymentMode: "Online", approvedBy: "Admin", receipt: "RCP-002" },
  { id: 3, date: "2024-03-12", description: "Educational Materials", category: "Education", amount: 4500, paymentMode: "Cash", approvedBy: "Admin", receipt: "RCP-003" },
  { id: 4, date: "2024-03-10", description: "Medical Supplies", category: "Medical", amount: 3800, paymentMode: "Cash", approvedBy: "Admin", receipt: "RCP-004" },
  { id: 5, date: "2024-03-08", description: "Staff Salaries", category: "Salaries", amount: 85000, paymentMode: "Bank Transfer", approvedBy: "Admin", receipt: "RCP-005" },
  { id: 6, date: "2024-03-05", description: "Maintenance & Repairs", category: "Maintenance", amount: 6000, paymentMode: "Cash", approvedBy: "Admin", receipt: "RCP-006" },
];

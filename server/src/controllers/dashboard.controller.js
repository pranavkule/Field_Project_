const prisma = require('../config/db');
const ApiResponse = require('../utils/ApiResponse');

const getSummary = async (req, res, next) => {
  const today = new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

  const [totalChildren, childrenByStatus, totalStaff, todaysStaffPresent, activeDonations, totalInventory, totalExpensesMonthly, recentHealthRecords] = await Promise.all([
    prisma.child.count(),
    prisma.child.groupBy({
      by: ['status'],
      _count: { status: true }
    }),
    prisma.staff.count(),
    prisma.staffAttendance.count({
      where: {
        status: 'Present',
        attendance_date: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    }),
    prisma.donation.count({
      where: { is_active: true }
    }),
    prisma.inventory.count(),
    prisma.expense.aggregate({
      _sum: {
        amount: true
      },
      where: {
        expense_date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      }
    }),
    prisma.healthRecord.findMany({
      orderBy: { record_date: 'desc' },
      take: 5
    })
  ]);

  const totalExpenses = totalExpensesMonthly._sum.amount || 0;

  const statusMap = childrenByStatus.reduce((acc, item) => {
    acc[item.status] = item._count.status;
    return acc;
  }, {});

  const response = {
    totalChildren,
    childrenByStatus: {
      active: statusMap.active || 0,
      inactive: statusMap.inactive || 0
    },
    totalStaff,
    todaysStaffPresent,
    totalActiveDonations: activeDonations,
    totalInventoryItems: totalInventory,
    totalExpensesThisMonth: totalExpenses,
    recentHealthRecords
  };

  res.status(200).json(new ApiResponse(200, response, 'Dashboard summary fetched successfully'));
};

module.exports = {
  getSummary
};
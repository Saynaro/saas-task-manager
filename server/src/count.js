import { prisma } from "./config/db.js";

async function main() {
  const count = await prisma.activityLog.count();
  console.log("ActivityLog count:", count);
  
  const activities = await prisma.activityLog.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      task: true
    }
  });
  console.log("Activities loaded:");
  activities.forEach((a, i) => {
    console.log(`${i + 1}: [${a.createdAt}] ${a.action} - ${a.user?.email}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

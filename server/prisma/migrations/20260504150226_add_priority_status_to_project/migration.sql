-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'LOW',
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';

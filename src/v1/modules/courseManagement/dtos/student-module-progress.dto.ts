export type TrackStudentModuleProgress = {
  studentId: string;
  moduleId: string;
  status?: string;
  startedAt: Date;
  completedAt?: Date;
};

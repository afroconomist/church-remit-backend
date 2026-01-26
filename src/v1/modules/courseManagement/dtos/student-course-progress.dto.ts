export type TrackStudentCourseProgress = {
  studentId: string;
  courseId: string;
  status?: string;
  startedAt: Date;
  completedAt?: Date;
};

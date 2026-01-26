export type TrackStudentLessonProgress = {
  studentId: string;
  lessonId: string;
  status?: string;
  startedAt: Date;
  completedAt?: Date;
};

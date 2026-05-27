export type CreateCourse = {
  courseTitle: string;
  description: Text;
  category: string;
  totalDuration: string;
  passingScore: number;
  enrollmentType: string;
  mandatoryCourse?: boolean;
  modules?: number;
  enrolled?: number;
  churchId: string;
};

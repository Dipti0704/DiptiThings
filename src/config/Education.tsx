export interface EducationEntry {
  school: string;
  degree: string;
  location: string;
  endDate: string;
  isCurrent?: boolean;
}

export const education: EducationEntry[] = [
  {
    school: 'Scaler School of Technology',
    degree: 'B.Sc. & M.Sc. in Computer Science',
    location: 'Bengaluru, India',
    endDate: 'Present (Started Jul 2023)',
    isCurrent: true,
  },
  {
    school: 'BITS Pilani',
    degree: 'B.Sc. in Computer Science',
    location: 'Bengaluru, India (Remote)',
    endDate: 'Present (Started Jul 2023)',
    isCurrent: true,
  },
];

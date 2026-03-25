export type FieldType = 'String' | 'Number' | 'Date';
export type TabKey = 'books' | 'decisions' | 'fields' | 'records' | 'lookup';
export interface CustomField {
  id: string;
  name: string;
  type: FieldType;
}
 
export interface DiplomaBook {
  id: string;
  year: number;
  counter: number;
}
 
export interface GraduationDecision {
  id: string;
  decisionNumber: string;
  issueDate: string;
  summary: string;
  bookId: string;
  lookupCount: number;
}
 
export interface DiplomaRecord {
  id: string;
  serialNumber: number;
  diplomaCode: string;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  decisionId: string;
  customValues: Record<string, string>;
}
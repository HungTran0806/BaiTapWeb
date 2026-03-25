import type { CustomField, DiplomaBook, GraduationDecision, DiplomaRecord, FieldType } from './types';

export const INIT_FIELDS: CustomField[] = [
  { id: 'f1', name: 'Dân tộc',         type: 'String' },
  { id: 'f2', name: 'Nơi sinh',        type: 'String' },
  { id: 'f3', name: 'Điểm trung bình', type: 'Number' },
  { id: 'f4', name: 'Xếp hạng',        type: 'String' },
  { id: 'f5', name: 'Hệ đào tạo',      type: 'String' },
  { id: 'f6', name: 'Ngày nhập học',   type: 'Date'   },
];

export const INIT_BOOKS: DiplomaBook[] = [
  { id: 'b2024', year: 2024, counter: 3 },
  { id: 'b2025', year: 2025, counter: 1 },
];

export const INIT_DECISIONS: GraduationDecision[] = [
  { id: 'd1', decisionNumber: '42/QĐ-ĐHXYZ', issueDate: '2024-06-15', summary: 'Quyết định tốt nghiệp đợt 1 năm 2024', bookId: 'b2024', lookupCount: 12 },
  { id: 'd2', decisionNumber: '98/QĐ-ĐHXYZ', issueDate: '2024-11-20', summary: 'Quyết định tốt nghiệp đợt 2 năm 2024', bookId: 'b2024', lookupCount: 7  },
  { id: 'd3', decisionNumber: '15/QĐ-ĐHXYZ', issueDate: '2025-06-10', summary: 'Quyết định tốt nghiệp đợt 1 năm 2025', bookId: 'b2025', lookupCount: 3  },
];

export const INIT_RECORDS: DiplomaRecord[] = [
  { id: 'r1', serialNumber: 1, diplomaCode: 'TN2024-001', studentId: 'SV20190001', fullName: 'Nguyễn Thị Lan',  dateOfBirth: '2001-03-12', decisionId: 'd1', customValues: { f1: 'Kinh', f2: 'Hà Nội',   f3: '3.65', f4: 'Giỏi',      f5: 'Chính quy', f6: '2019-09-01' } },
  { id: 'r2', serialNumber: 2, diplomaCode: 'TN2024-002', studentId: 'SV20190042', fullName: 'Trần Minh Tuấn', dateOfBirth: '2001-07-25', decisionId: 'd1', customValues: { f1: 'Kinh', f2: 'TP.HCM',  f3: '3.20', f4: 'Khá',       f5: 'Chính quy', f6: '2019-09-01' } },
  { id: 'r3', serialNumber: 3, diplomaCode: 'TN2024-003', studentId: 'SV20190115', fullName: 'Lê Thu Hà',      dateOfBirth: '2001-01-08', decisionId: 'd2', customValues: { f1: 'Tày', f2: 'Lào Cai', f3: '3.85', f4: 'Xuất sắc', f5: 'Chính quy', f6: '2019-09-01' } },
  { id: 'r4', serialNumber: 1, diplomaCode: 'TN2025-001', studentId: 'SV20200077', fullName: 'Phạm Quốc Huy',  dateOfBirth: '2002-05-19', decisionId: 'd3', customValues: { f1: 'Kinh', f2: 'Đà Nẵng', f3: '3.45', f4: 'Khá',       f5: 'Chính quy', f6: '2020-09-01' } },
];

export const TYPE_COLOR: Record<FieldType, string> = {
  String: 'blue',
  Number: 'gold',
  Date:   'green',
};

export const TABS = [
  { key: 'books',     label: 'Sổ văn bằng'       },
  { key: 'decisions', label: 'Quyết định TN'      },
  { key: 'fields',    label: 'Cấu hình biểu mẫu' },
  { key: 'records',   label: 'Văn bằng'           },
  { key: 'lookup',    label: 'Tra cứu'            },
];
import { Input, Select, DatePicker, Space, Segmented } from 'antd';
import type { Moment } from 'moment';

type Props = {
  search?: string;
  onSearch?: (v: string) => void;
  typeOptions?: string[];
  selectedType?: string;
  onTypeChange?: (v?: string) => void;
  groupOptions?: string[];
  selectedGroup?: string;
  onGroupChange?: (v?: string) => void;
  dateRange?: [Moment, Moment] | null;
  onDateRangeChange?: (v: any) => void;
  segmentedOptions?: string[];
  segmentedValue?: string | number;
  onSegmentedChange?: (v: string | number) => void;
};

const Filters = ({ search, onSearch, typeOptions = [], selectedType, onTypeChange, groupOptions = [], selectedGroup, onGroupChange, dateRange, onDateRangeChange, segmentedOptions, segmentedValue, onSegmentedChange }: Props) => {
  return (
    <Space wrap style={{ width: '100%' }}>
      <Input placeholder="Tìm kiếm" value={search} onChange={(e) => onSearch?.(e.target.value)} allowClear style={{ minWidth: 220 }} />
      {typeOptions.length > 0 && (
        <Select placeholder="Loại" value={selectedType || undefined} onChange={(v) => onTypeChange?.(v)} allowClear style={{ minWidth: 160 }}>
          {typeOptions.map((t) => (
            <Select.Option key={t} value={t}>{t}</Select.Option>
          ))}
        </Select>
      )}
      {groupOptions.length > 0 && (
        <Select placeholder="Nhóm" value={selectedGroup || undefined} onChange={(v) => onGroupChange?.(v)} allowClear style={{ minWidth: 160 }}>
          {groupOptions.map((g) => (
            <Select.Option key={g} value={g}>{g}</Select.Option>
          ))}
        </Select>
      )}
      <DatePicker.RangePicker value={dateRange as any} onChange={(v) => onDateRangeChange?.(v)} />
      {segmentedOptions && <Segmented options={segmentedOptions} value={segmentedValue} onChange={(v) => onSegmentedChange?.(v)} />}
    </Space>
  );
};

export default Filters;

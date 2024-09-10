import { PolicyFilter } from '../../Policy/index';

export interface ListProps {
  title: string;
  api: string;
  params: Partial<PolicyFilter>;
}

export interface Result<T> {
  current: number;
  maxLimit: null;
  pages: string;
  records: T[];
  size: number;
  total: number;
}

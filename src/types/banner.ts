export interface Banner {
  _id: string;
  title: string;
  image: string;
  link?: string;
  link_type: 'internal' | 'external' | 'none';
  position: 'home-slider' | 'home-top' | 'home-middle' | 'home-bottom' | 'sidebar';
  order: number;
  description?: string;
  button_text?: string;
  status: 'active' | 'inactive';
  start_date?: string;
  end_date?: string;
  view_count: number;
  click_count: number;
  createBy?: {
    _id: string;
    fullName: string;
  };
  updateBy?: {
    _id: string;
    fullName: string;
  };
  createdAt?: string;
  updatedAt?: string;
  deleted: boolean;
}

export interface BannerFormData {
  title: string;
  image?: File;
  link?: string;
  link_type: 'internal' | 'external' | 'none';
  position: string;
  order?: number;
  description?: string;
  button_text?: string;
  status: string;
  start_date?: string;
  end_date?: string;
}

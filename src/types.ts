export interface Metadata {
  chapters: Chapter[];
}

export interface Chapter {
  id: number;
  time_base: string;
  start: number;
  start_time: string;
  end: number;
  end_time: string;
  tags: Tags;
}

export interface Tags {
  title: string;
}

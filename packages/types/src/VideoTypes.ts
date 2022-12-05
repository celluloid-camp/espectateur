export type Player
  = 'Peertube'
  | 'Local'
  ;

export interface VideoUpdateData {
    dublin_title?: string[];
    dublin_creator?: string[];
    dublin_subject?: string[];
    dublin_description?: string[];
    dublin_publisher?: string[];
    dublin_contributor?: string[];
    dublin_date?: string[];
    dublin_type?: string[];
    dublin_format?: string[];
    dublin_identifier?: string[];
    dublin_source?: string[];
    dublin_language?: string[];
    dublin_relation?: string[];
    dublin_coverage?: string[];
    dublin_rights?: string[]; 
  }

export interface VideoData extends VideoUpdateData {
    title: string;
    player: Player;
    path: string;
}

export interface VideoRecord extends VideoData {
  id: string;
}
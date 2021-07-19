export interface Tracks {
    href:     string;
    items:    Item[];
    limit:    number;
    next:     null;
    offset:   number;
    previous: null;
    total:    number;
}

export interface Item {
    artists:       LinkedFrom[];
    disc_number:   number;
    duration_ms:   number;
    explicit:      boolean;
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    is_local:      boolean;
    is_playable:   boolean;
    linked_from:   LinkedFrom;
    name:          string;
    preview_url:   string;
    track_number:  number;
    type:          Type;
    uri:           string;
}

export interface LinkedFrom {
    external_urls: ExternalUrls;
    href:          string;
    id:            string;
    name?:         string;
    type:          Type;
    uri:           string;
}

export interface ExternalUrls {
    spotify: string;
}

export enum Type {
    Artist = "artist",
    Track = "track",
}
export interface MediaDetail {
    media_id: number;
    media_cat: string;
}

export interface HoardingDetail {
    Hoarding_ID: number;
    District: string;
    "Location/Route": string;
    "Direction/Route": string;
    "Size W": number;
    "Size H": number;
    Area: number;
    Type: string;
    "Rate/Sqft 1 M": number;
    "Rate/Sqft 3 M": number;
    "Rate/Sqft 6 M": number;
    "Rate/Sqft 12 M": number;
    Floor: string;
}

export interface HoardingRequest {
    request_id: number;
    created_at: string;
    updated_at: string;
    hoarding_id: number;
    current_status: 'pending' | 'approved' | 'rejected';
    media_ids: number[];
    rejection_count: number;
    requested_by: number;
    action_by: number;
    comment: string | null;
    rejected_media_ids: number[] | null;
    media_details?: MediaDetail[];
    hoarding_details: HoardingDetail;
}

export interface FetchHoardings {
    message: string;
    payload: {
        data: HoardingRequest[];
    };
}

export interface HoardingStats {
    message: string;
    payload: {
        total_hoardings: number;
        pending_hoardings: number;
        rejected_hoardings: number;
        approved_hoardings: number;
    };
}

export interface RequestData {
    request_id: number;
    current_status: 'pending' | 'approved' | 'rejected';
    rejection_count: number;
    requested_by: number;
    action_by: number;
    created_at: string;
    updated_at: string;
    comment: string | null;
}

export interface HoardingData {
    Hoarding_ID: number;
    District: string;
    "Location/Route": string;
    "Direction/Route": string;
    "Size W": number;
    "Size H": number;
    Area: number;
    Type: string;
    "Rate/Sqft 1 M": number;
    "Rate/Sqft 3 M": number;
    "Rate/Sqft 6 M": number;
    "Rate/Sqft 12 M": number;
    Floor: string;
}

export interface MediaData {
    media_name: string;
    media_type: string;
    presigned_url: string;
}

export interface FetchHoardingRequest {
    message: string;
    payload: {
        request_data: RequestData;
        hoarding_data: HoardingData;
        media_data: MediaData[];
    };
}

export interface LoginResponse {
    message: string;
    payload: {
      user_id: number;
      is_admin: boolean | null;
      is_labour: boolean | null;
    }
  }
  
  
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RequestActionParams {
    action: string;
    request_id: number | undefined;
    user_id: number | null;
    comment: string;
}

export interface RequestActionResponse {
    message: string;
}
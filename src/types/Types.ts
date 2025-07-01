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
        available_hoardings: number;
        booked_hoardings: number;
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
    Hoarding_Code: string;
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
    "Start Date": string;
    "End Date": string
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
      role: string;
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
    start_date: string;
    end_date: string;
}

export interface RequestActionResponse {
    message: string;
}

export interface SubmitQueryResponse {
    message: string;
    response: {
        district: string[];
        location: string[];
        direction_route: string[];
        width: number[];
        height: number[];
        area: number[];
        type: string[];
        rate_sqft_1_months: number[];
        rate_sqft_3_months: number[];
        rate_sqft_6_months: number[];
        rate_sqft_12_months: number[];
        floor: string[];
        hoarding_id: number[];
        hoarding_code: string[];
        status: string[];
        location_coordinates: string[];
        available: boolean[];
        lat: number[];
        long: number[];
    };
}

export interface BotResponseProps {
    content: {
        district: string[];
        location: string[];
        direction_route: string[];
        width: number[];
        height: number[];
        area: number[];
        type: string[];
        rate_sqft_1_months: number[];
        rate_sqft_3_months: number[];
        rate_sqft_6_months: number[];
        rate_sqft_12_months: number[];
        floor: string[];
        hoarding_id: number[];
        hoarding_code: string[];
        status: string[];
        location_coordinates: string[];
        available: boolean[];
        lat: number[];
        long: number[];
    } | string;
}

export interface DownloadOption {
    id: string;
    label: string;
    selected: boolean;
    icon: React.ReactNode;
}

export interface AddAdminProps {
    username: string,
    email_id: string,
    password: string,
    phone_number: 0,
    role: string,
    terms: true
}

export interface AddAdminResponse {
    message: string,
    payload: Object
}

export interface DBHoardingData {
    district: string;
    location_route: string;
    direction_route: string;
    width: number;
    height: number;
    area: number;
    type: string;
    rate_sqft_1_months: number;
    rate_sqft_3_months: number;
    rate_sqft_6_months: number;
    rate_sqft_12_months: number;
    floor: string;
    hoarding_id: number;
    hoarding_code: string;
    status: string;
    location: string;
    available: boolean;
    lat: number;
    long: number;
}

export interface GetDBDataResponse {
    message: string;
    payload: {
        data_list_dict: DBHoardingData[];
    }
}

export interface DBUpdateRequest {
  hoarding_id: number;
  [key: string]: string | number | boolean;
}

export interface DBUpdateResponse {
  message: string;
  payload?: any;
}

export interface NewHoardingRow {
  hoarding_id: number | null;
  district: string;
  location: string;
  direction_route: string;
  width: number | null;
  height: number | null;
  area: number | null;
  type: string;
  rate_sqft_1_months: number | null;
  rate_sqft_3_months: number | null;
  rate_sqft_6_months: number | null;
  rate_sqft_12_months: number | null;
  floor: string;
  hoarding_code: string;
  status: string;
  available: string;
  location_coordinates: string | null;
  notes: string | null;
};

export interface DeleteHoardingRequest {
    hoarding_id: number;
}
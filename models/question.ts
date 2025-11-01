export interface Question{
    id?: string;
    text: string;
    order_index?: number;
    type: string;    
    options?: string[]; 
    survey_id: string;
}
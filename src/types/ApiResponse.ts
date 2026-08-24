export interface ApiResponse<T> {
    success: boolean;
    message: string;
    status: number;
    data: T | null;
}
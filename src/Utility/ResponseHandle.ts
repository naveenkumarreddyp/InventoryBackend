// Interface for structured response
export interface ApiResponse {
  success: boolean;
  statuscode: number;
  data?: any;
}

class HandleResponse {
  // Method to handle response formatting
  public static handleResponse(
    success: boolean,
    statuscode: number,
    data?: any
  ): ApiResponse {
    return { success, statuscode, data };
  }
}

export default HandleResponse;

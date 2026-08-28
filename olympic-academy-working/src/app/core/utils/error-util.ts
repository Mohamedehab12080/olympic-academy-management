// core/utils/error-utils.ts
import { ErrorVTO } from "../models/common.model";
export function extractErrorMessage(error: any): string {
  // Default message
  let message = 'حدث خطأ غير متوقع';
  
  if (!error) {
    return message;
  }
  
  // Case 1: Direct ErrorVTO
  if (error.messageEn) {
    message = error.messageEn;
    // If there are field errors, append them
    if (error.reqBodyErrors && error.reqBodyErrors.length > 0) {
      message += ': ' + error.reqBodyErrors.join(', ');
    }
    return message;
  }
  
  // Case 2: Error is wrapped (common with HttpClient)
  if (error.error) {
    if (error.error.messageEn) {
      message = error.error.messageEn;
      if (error.error.reqBodyErrors && error.error.reqBodyErrors.length > 0) {
        message += ': ' + error.error.reqBodyErrors.join(', ');
      }
      return message;
    }
    // If error.error is a string
    if (typeof error.error === 'string') {
      return error.error;
    }
  }
  
  // Case 3: Simple string error
  if (typeof error === 'string') {
    return error;
  }
  
  // Case 4: Error object with message property
  if (error.message) {
    return error.message;
  }
  
  // Case 5: Array of errors
  if (Array.isArray(error)) {
    return error.join(', ');
  }
  
  return message;
}

// Additional utility to check if error is ErrorVTO
export function isErrorVTO(error: any): error is ErrorVTO {
  return error && typeof error === 'object' && 'messageEn' in error;
}
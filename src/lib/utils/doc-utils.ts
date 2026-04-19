import type { RequestWithResident } from '@/lib/requests';
import { calculateAge, getOrdinal, formatFullDate } from './date-utils';

/**
 * Prepares and formats data for use in .docx templates.
 * @param request - The document request containing resident data.
 * @returns A flattened object containing all necessary tags for the template.
 */
export function prepareTemplateData(request: RequestWithResident) {
  const res = request.residents;
  const now = new Date();
  const birthDate = new Date(res.birth_date);
  
  const age = calculateAge(birthDate);
  const day = now.getDate();
  const month = now.toLocaleDateString('en-US', { month: 'long' });
  const year = now.getFullYear();

  return {
    fullName: `${res.first_name} ${res.last_name}`,
    age: age,
    civilStatus: res.civil_status,
    birthday: formatFullDate(birthDate),
    occupation: res.occupation || 'N/A',
    gender: res.gender,
    address: res.address,
    phoneNo: res.mobile_number,
    purpose: request.purpose,
    day: getOrdinal(day),
    month: month,
    year: year,
    barangay: 'San Juan', // This could be made dynamic later
    currentDate: formatFullDate(now),
  };
}

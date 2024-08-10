// holidayService.js
import axios from 'axios';

const BASE_URL = 'https://date.nager.at/Api';

export const fetchHolidays = async (countryCode, year) => {
  try {
    const response = await axios.get(`${BASE_URL}/v2/PublicHolidays/${year}/${countryCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return [];
  }
};

import fetch from 'node-fetch';



async function testAPICall() {
  try {
    const response = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records');
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', data.results);
      console.log('total countries: ', data.results.cou_name_en.length);
      console.log('total timezones: ', data.results.timezone.length);
    } else {
      console.error('Failed to fetch data:', response.statusText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPICall();


// <td>{city.name}</td>
//                 <td>{city.cou_name_en}</td>
//                 <td>{city.timezone}</td>
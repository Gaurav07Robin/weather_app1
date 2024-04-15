import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBox from './SearchBox';
import { Link } from 'react-router-dom';

interface CitiesTableProps {
  favCity: string;
  isFavourite: boolean;
}

const CitiesTable: React.FC<CitiesTableProps> = ({  favCity: favCity, isFavourite }) => {
  const history = useNavigate();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const tableRef = useRef<HTMLTableElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);
  const [sortConfig, setSortConfig] = useState({ key : '', direction: 'ascending' });
  const[refineZone, setRefineZone] = useState("");
  const[refineCity, setRefineCity] = useState("");
  const [refineCountry, setRefineCountry] = useState("");
  const[value1, setValue1] = useState('');
  const[value2, setValue2] = useState('');
  const[value3, setValue3] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lati: number | null, longi: number | null }>({ lati: null, longi: null });
  let navigate = useNavigate();

  let favCityArray: string[] = [];

  if (favCity && isFavourite) {
    favCityArray = [...favCityArray, favCity];
  }
  



  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setRefineCity(event.target.value);
  };

  const handleInputChange2 = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setRefineCountry(event.target.value);
  };

  const handleInputChange3 = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setRefineZone(event.target.value);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

  const handleSort = (key: string ) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedCities = [...filteredCities].sort((a, b) => {
      // Here, we use the logical OR operator to handle the case when key is null
      // In that case, we'll sort based on the city name by default
      if (key && a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (key && a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    setFilteredCities(sortedCities);
    setSortConfig({ key, direction });
  };
  

  
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const searchTerm = e.target.value;

    setRefineZone(searchTerm);
  };

  useEffect( () => {
    fetchCities();
  }, [ refineCountry]);
  

  useEffect(() => {
    fetchCities();
  }, [])


 
  const handleFetchLocation = () => {
    console.log('Location icon clicked');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lati: position.coords.latitude,
            longi: position.coords.longitude,
          });
          // Navigate to the new weather page with latitude and longitude as parameters
          navigate(`/weather/${position.coords.latitude}/${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };


  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lati: position.coords.latitude,
            longi: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);


  const fetchCities = async () => {
    try {
      setLoading(true);
     // const response = await fetch('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=10&offset=${page}');

     let apiUrl = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=10&offset=${page}` + 
      (refineZone ? `&refine=timezone%3A"${refineZone}"` : '') + (refineCity ? `&refine=name%3A"${refineCity}"` : '')  +  (refineCountry ? `&refine=cou_name_en%3A"${refineCountry}"` : '') ;
  //    if (refineCity) {
  //     // Append refineCity to the URL
  //     apiUrl += `&refine=name%3A"${refineCity}"`;
  // }
  
  // // Check if refineZone is provided
  // if (refineZone) {
  //     // Append refineZone to the URL
  //     apiUrl += `&refine=timezone%3A"${refineZone}"`;
  // }
  
  // // Check if refineCountry is provided
  // if (refineCountry) {
  //     // Append refineCountry to the URL
  //     apiUrl += `&refine=cou_name_en%3A"${refineCountry}"`;
  // }
  //    console.log("apiURL: ", apiUrl);
   
   const response = await fetch(apiUrl);
   


      if (response.ok) {
        
        console.log("refine zone: ", refineZone);
      

        const data = await response.json();

        console.log("after refine zone: ", data.results);
        console.log("length: :" , data.results);

        console.log("json data: ", data);
        if (data.results.length > 0) {
            console.log("Hey, length > 0");
            console.log("page si :  ", page);
            
            setCities(prevCities => [...prevCities, ...data.results]);
            console.log("cities are : ", cities);
            setPage(page + 1);
          } else {
            // No more records available
            setHasMore(false);
          }

      } else {
        console.error('Failed to fetch cities');
      }

    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  
  
  
  const handleScroll = () => {
    const table = tableRef.current;
    if (table) {
      const { scrollTop, clientHeight, scrollHeight } = table;
      if (scrollTop + clientHeight >= scrollHeight  && !loading && hasMore) {
        fetchCities();
      }
    }
  };


  

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

   
  useEffect(() => {
    setFilteredCities(cities);
  }, [cities]);

  useEffect(() => {
    const filteredCities = cities.filter(city =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filteredCities);
  }, [searchTerm, cities]);

  useEffect(() => {
    if (sortConfig.key !== '') {
      const sortedCities = [...cities].sort((a, b) => {
        const keyA = a[sortConfig.key].toLowerCase();
        const keyB = b[sortConfig.key].toLowerCase();
        if (keyA < keyB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (keyA > keyB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
      setCities(sortedCities);
    }
  }, [sortConfig]);

  return (
    <div>
      <div>
         
      </div>
      <div className='searchbox'>
      <i className="bi bi-geo" onClick={handleFetchLocation}></i>
        <SearchBox
          placeholder="Search cities..."
          options={cities.map(city => city.name)}
          handleChange={handleChange}
        />
      </div>
      <div style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }} onScroll={handleScroll}>
        <table className="table" ref={tableRef}>
          <thead>
            <tr>
              <th>
                <input
                  type="text"
                  value={refineCity}
                  placeholder="Filter by Name"
                  onChange={(e) => handleInputChange1(e, "name")}
                />
                <button onClick={() => handleSort('name')}>
                  Sort {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <input
                  type="text"
                  value={refineCountry}
                  placeholder="Filter by Country"
                  onChange={(e) => handleInputChange2(e, "country")}
                />
                <button onClick={() => handleSort('cou_name_en')}>
                  Sort {sortConfig.key === 'cou_name_en' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </button>
              </th>
              <th>
                <input
                  type="text"
                  value={refineZone}
                  placeholder="Filter by Timezone"
                  onChange={(e) => handleInputChange3(e, "timezone")}
                />
                <button onClick={() => handleSort('timezone')}>
                  Sort {sortConfig.key === 'timezone' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map((city, index) => (
              <tr key={index}>
                <td>
                <Link to={`/weather/${city.name}`}>{city.name}</Link>
                </td>
                <td>{city.cou_name_en}</td>
                <td>{city.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>Loading...</p>}
        {!hasMore && <p>No more cities to load</p>}
      </div>
    </div>
  );
};

export default CitiesTable;

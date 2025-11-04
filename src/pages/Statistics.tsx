import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { RiGasStationFill  } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { SUB_ZONES, MANAGEMENT_MODES, SEGMENTATIONS } from '../constants';
import axios from 'axios';
import FamilleInvariants from '../components/FamilleInvariants';
import ScoreTotal from '../components/ScoreTotal';
import { statsImg } from '../assets';

interface FilterInterface{
    label: string,
    values: string[],
    enabled?: boolean
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

ChartJS.register(ArcElement, Tooltip, Legend);

export const doughnutData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Attribute ERIS',
      font: {
        size: 14
      }
    },
    datalabels: {
      anchor: 'end' as const,
      align: 'top' as const,
      formatter: (value: number) => value,
      font: {
        size: 11,
        weight: 'bold' as const
      },
      color: '#333'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        display: false
      },
      grid: {
        display: false
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      }
    }
  }
};

// Generate labels like EP01, EP02, ES01, ES02, ET01, etc.
const epLabels = Array.from({ length: 11 }, (_, i) => `EP${String(i + 1).padStart(2, '0')}`);
const esLabels = Array.from({ length: 9 }, (_, i) => `ES${String(i + 1).padStart(2, '0')}`);
const etLabels = Array.from({ length: 5 }, (_, i) => `ET${String(i + 1).padStart(2, '0')}`);

const allLabels = [...epLabels, ...esLabels, ...etLabels];

// Generate colors: red for EP, yellow for ES, blue for ET
const generateColors = () => {
  const colors = [];
  
  // Red for EP (11 bars)
  for (let i = 0; i < 11; i++) {
    colors.push('rgba(226, 0, 0, 0.8)');
  }
  
  // Yellow for ES (9 bars)
  for (let i = 0; i < 9; i++) {
    colors.push('rgba(230, 210, 0, 0.8)');
  }
  
  // Blue for ET (5 bars)
  for (let i = 0; i < 5; i++) {
    colors.push('rgba(0, 123, 255, 0.8)');
  }
  
  return colors;
};

export const data = {
  labels: allLabels,
  datasets: [
    {
      label: 'Attribute ERIS',
      data: Array.from({ length: allLabels.length }, (_,i) => i*0),
      backgroundColor: generateColors(),
      borderRadius: 8, 
      barThickness: 20, 
    }
  ],
};

const Statistics = () => {
  const [selectedFilterValues, setSelectedFilterValues] = useState<{key: string, value: string}[]>([]);
  const [graphData, setGraphData] = useState<any>(data);
  const [isFetchingFilters, setIsFetchingFilters] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchValue1, setSearchValue1] = useState<string>('');
  const [totalStations, setTotalStations] = useState<string>('0');
  const [scopeFamilleData, setScopeFamilleData] = useState<number[]>([]);
  const [scoreAvgScore, setScoreAvgScore] = useState<number>(0);

  const getSubZone=()=>{
    return Object.keys(SUB_ZONES);
  }

  const [filters,setFilters] = useState<FilterInterface[]>([
    {
        label: "Date",
        values: [],
        enabled: true
    },
    {
        label: "Sub Zone",
        values: getSubZone(),
        enabled: true
    },
    {
        label: "Affiliate",
        values: [],
        enabled: false
    },
    {
        label: "Station Code",
        values: [],
        enabled: true
    },
    {
        label: "Station Name",
        values: [],
        enabled: true
    },
    {
        label: "Management Mode",
        values: [...MANAGEMENT_MODES],
        enabled: true
    },
    {
        label: "Segmentation",
        values: [...SEGMENTATIONS],
        enabled: true
    }
  ])

  const getSelectedFilter=(value:string, label:string)=>{
    if(label === "Sub Zone"){ 
       const subZonesCountries = SUB_ZONES[value as keyof typeof SUB_ZONES];
       const tempFilters = [...filters];
       const affiliateFilterIndex = tempFilters.findIndex(filter => filter.label === 'Affiliate');
       if(affiliateFilterIndex !== -1){
           tempFilters[affiliateFilterIndex].values = subZonesCountries;
       }
       setFilters(tempFilters);
    };
    const labels = label.trim().split(" ")
    if(labels.length > 1){
        label = labels.join("_");
    }
    updateSelectedFilters(label.toLocaleLowerCase(), value);
  }

  const updateSelectedFilters=(key:string, value:string)=>{
    if(!key || !value) return;
    const temp = [...selectedFilterValues];
    const index = temp.findIndex(item=> item.key === key);
    if(index !== -1){
        temp[index].value = value;
    }else{
        temp.push({key, value});
    }
    setSelectedFilterValues(temp);
  }

  const removeSelectedFilter=(key:string)=>{
    const temp = [...selectedFilterValues];
    const index = temp.findIndex(item=> item.key === key);
    if(index !== -1){
        temp.splice(index, 1);
    }
    setSelectedFilterValues(temp);
  }

  const buildSearchQuery=()=>{
    const temp = [...selectedFilterValues];
    if(temp.length === 0) return '';
    let query = '?';
    temp.forEach((item, index) => {
        query += `${item.key}=${item.value}${index < temp.length - 1 ? '&' : ''}`;
    });
    return query;
}

const getStatisticsByFilter=async()=>{
    if(selectedFilterValues.length === 0) return;
    const query = buildSearchQuery();
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/get-statistics-by-filter${query}`);
        const data = res.data;
        console.log("Statistics by filter data: ", data);
         setScoreAvgScore(data.total_score_mean ? Math.round(Number(data.total_score_mean)) : 0);
        if(data){
            const newData: number[] = [];
            const keys = ['ep', 'es', 'et'];
            const tempScopeFamilleData = {
                ep: Math.round(
                    (Object.values(data.ep).map(Number).reduce((a, b) => a + b, 0)) / Object.keys(data.ep).length
                ),
                es: Math.round(
                    (Object.values(data.es).map(Number).reduce((a, b) => a + b, 0)) / Object.keys(data.es).length
                ),
                et: Math.round(
                    (Object.values(data.et).map(Number).reduce((a, b) => a + b, 0)) / Object.keys(data.et).length
                )
            }

            keys.forEach((key)=>{
                if(data[key]){
                   const valuesArray = Object.values(data[key]).map((val:any) => Math.round(Number(val)));
                   newData.push(...valuesArray);
                }
            });
              setGraphData({
                labels: allLabels,
                datasets: [
                    {
                        label: 'Attribute ERIS',
                        data: newData,
                        backgroundColor: generateColors(),
                        borderRadius: 8,
                        barThickness: 20,
                    }
                ]
            });
            setScopeFamilleData(tempScopeFamilleData ? [
                Number(tempScopeFamilleData.ep),
                Number(tempScopeFamilleData.es),
                Number(tempScopeFamilleData.et)
            ] : []);
            setTotalStations(data.total_records || '0');
        }
    } catch (error) {
        console.error(`Error fetching statistics by filter ${error}`);
    }
}

const fetchAllFilters = async () => {
    setIsFetchingFilters(true);
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/get-filters`);
        const data = res.data;
        const temp = [...filters];
        temp.forEach((filter)=>{
            if(filter.label === 'Date'){
                filter.values = data.files_creation_date;
            }
            if(filter.label === 'Station Code'){
                filter.values = data.station_code;
            }
            if(filter.label === 'Station Name'){
                filter.values = data.station_name;
            }
        });
        setFilters([...temp]);
    } catch (error) {
        console.error(`Error fetching filters ${error}`);
    } finally {
        setIsFetchingFilters(false);
    }
};

useEffect(() => {
    if(selectedFilterValues.length > 0){
        getStatisticsByFilter();
    }
}, [selectedFilterValues]);

useEffect(() => {
    fetchAllFilters();
}, []);

return (
    <div className='w-full h-screen flex justify-around items-center'>
            <div className='w-[75%] h-[95%] flex justify-center items-center flex-col'>
            <div className='w-full h-1/4 flex justify-around items-center mb-4'>
            {/* Graphiques scope famille invariant %  */}
                <div className='w-[32%] border-1 border-gray-100 h-full rounded-md shadow-md '>
                    <FamilleInvariants propsData={scopeFamilleData} />
                </div>
                <div className='w-[32%] border-1 border-gray-100 h-full rounded-md shadow-md'>
                    <img src={statsImg} alt="Statistics" className='w-full h-full object-contain rounded-md'/>
                </div>
                <div className='w-[32%] border-1 border-gray-100 h-full rounded-md shadow-md'>
                    <ScoreTotal score={scoreAvgScore} maxScore={100} />
                </div>
            </div>
            <div className='w-full h-3/4 flex justify-around items-center'>
                <div style={{ height: '500px', width: '100%' }} className='shadow-md rounded border-gray-200 border-1'>
                    <Bar options={options} data={graphData} />
                </div>
            </div>
        </div>


        {/* Menu de selection  */}
        <div className='w-[22%] h-[97%] flex flex-col justify-between'>
            
            <div className='w-full h-[78%] p-1 shadow-sm rounded-sm'>
            <div className='w-full h-[auto] p-1 rounded-sm'>
                <ul className='flex flex-wrap'>
                    {
                        selectedFilterValues?.map((item,index)=>(
                            <li key={index} className='flex items-center bg-red-500 text-gray-50 rounded-sm p-0.5 m-1'><span className='text-xs p-1'>{item.value}</span> <MdOutlineCancel className='cursor-pointer' onClick={()=>removeSelectedFilter(item.key)}/></li>
                        ))
                    }
                </ul>
            </div>
            {
    filters?.map((item, index) => {
        // Check if sub_zone has been selected
        const isSubZoneSelected = selectedFilterValues.findIndex((filter) => filter.key === 'sub_zone') !== -1;
        
        if (item.label === 'Affiliate' && !isSubZoneSelected) {
            return null;
        }
        
        if(item.label === 'Station Name'){
            return (
                <div key={index}>
                    <label htmlFor="countries" className="block my-1 ml-2 text-sm font-medium text-gray-900">
                        {item.label}
                    </label>
                    <input type="text" onKeyPress={(e)=> setSearchValue(e.target.value)} className="w-[95%] mb-2 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block py-2 px-2.5" />
                    {
                        searchValue && (
                            <ul className='max-h-56 overflow-y-auto rounded w-[330px] absolute bg-gray-100 border-1 border-gray-200 mt-1'>
                                {
                                    item?.values?.filter((val) => val.toLowerCase().includes(searchValue.toLowerCase()))?.map((val, idx) => (
                                        <li key={idx} onClick={() =>{
                                             getSelectedFilter(val, item.label)
                                            setSearchValue('')
                                        }} className='p-1 hover:bg-gray-100 cursor-pointer'>{val}</li>
                                    ))
                                }
                            </ul>
                        )
                    }
                </div>
            )
        }
        if(item.label === 'Station Code'){
            return (
                <div key={index}>
                    <label htmlFor="countries" className="block my-1 ml-2 text-sm font-medium text-gray-900">
                        {item.label}
                    </label>
                    <input type="text" onKeyPress={(e)=> setSearchValue1(e.target.value)} className="w-[95%] mb-2 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block py-2 px-2.5" />
                    {
                        searchValue1 && (
                            <ul className='max-h-56 overflow-y-auto rounded w-[330px] absolute bg-gray-100 border-1 border-gray-200 mt-1'>
                                {
                                    item?.values?.filter((val) => val.toLowerCase().includes(searchValue1.toLowerCase()))?.map((val, idx) => (
                                        <li key={idx} onClick={() =>{
                                             getSelectedFilter(val, item.label)
                                            setSearchValue1('')
                                        }} className='p-1 hover:bg-gray-100 cursor-pointer'>{val}</li>
                                    ))
                                }
                            </ul>
                        )
                    }
                </div>
            )
        }

        return (
            <div key={index}>
                <label htmlFor="countries" className="block my-1 ml-2 text-sm font-medium text-gray-900">
                                {item.label}
                            </label>
                            <select 
                                onChange={(e) => getSelectedFilter(e.target.value, item.label)} 
                                id="countries" 
                                className="w-[95%] mb-2 ml-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block py-2 px-2.5"
                            >
                                {
                                    item?.values?.map((val, idx) => (
                                        <option value={val} key={idx}>{val}</option>
                                    ))
                                }
                            </select>
                        </div>
                    );
                })
            }
            </div>
            <div className='w-full h-[20%] shadow-md border-1 flex justify-center items-center flex-col border-gray-200 rounded-sm'>
                <p className='m-2 text-lg text-[#2962ff]'>Stations Inspectées</p>
                <div className='w-full flex items-center justify-center'>
                    <h2 className='text-[4rem] font-light mr-4 text-[#2962ff]'>{totalStations}</h2>
                    <RiGasStationFill size={48} />
                </div>
            </div>
        </div>
    </div>
  );
}

export default Statistics;
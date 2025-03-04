import React from 'react';
import { Collapse } from 'antd';
import GetStatsByendpoint from './GetStatsByendpoint';
import { AutoComplete, Input } from 'antd';
import { useState, useEffect } from 'react';
import axios from 'axios';
import GetTimeGraphs from './GetTimeGraphs';
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;


//buradaki index alanı daha sonra dinamik olarak güncellenmeli

const CollapseStats = ({index_name}) => {
  const [endpointOptions, setEndpointOptions] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [endpointKpiData,setEndpointKpiData]=useState(null);

  //buradaki index değeri sonradan değiştirilmeli
  const items = [
    {
      key: '1',
      label: 'Servisin Genel İstatistikleri',
      children:  <GetStatsByendpoint index_name={localStorage.getItem('selectedIndex')} endpoint={selectedEndpoint} />,
    },
    {
      key: '2',
      label: 'Servisin Zamansal Grafikleri',
      children: <GetTimeGraphs index_name={localStorage.getItem('selectedIndex')} endpoint={selectedEndpoint}/>,
    }
  ];
  
  // Endpointleri getir
  const getEndpointsFromELK = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/list_endpoints/?index_name=${index_name}`
      );
      const formattedData = data.map((endpoint) => ({
        value: endpoint,
        label: endpoint,
      }));
      setEndpointOptions(formattedData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getEndpointsFromELK();
    console.log(localStorage.getItem('selectedIndex'))
  }, []);
  return(
    <div>
      <div className='centered-container-for-select-menu-on-top'>
      <AutoComplete
        popupClassName="certain-category-search-dropdown"
        popupMatchSelectWidth={500}
        style={{ width: 550 }}
        options={endpointOptions}
        onSelect={(option) => setSelectedEndpoint(option)}
        size="large"
      >
        <Input.Search size="large" placeholder="endpoint seçin" />
      </AutoComplete>
      </div>
       
      <Collapse accordion items={items} />
    </div>

  )
}
export default CollapseStats;
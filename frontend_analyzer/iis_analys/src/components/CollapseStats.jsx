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

const CollapseStats = () => {
  const [endpointOptions, setEndpointOptions] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [endpointKpiData,setEndpointKpiData]=useState(null);

  //buradaki index değeri sonradan değiştirilmeli
  const index="iislogs_20241019_000003_968435df"
  const items = [
    {
      key: '1',
      label: 'Endpoint Genel İstatistik',
      children:  <GetStatsByendpoint index_name={index} endpoint={selectedEndpoint} />,
    },
    {
      key: '2',
      label: 'Zamansal Grafikler',
      children: <GetTimeGraphs index_name={index} endpoint={selectedEndpoint}/>,
    },
    {
      key: '3',
      label: 'This is panel header 3',
      children: <p>{text}</p>,
    },
  ];

  const getIndicesFromApi = async () => {
    await axios
      .get(
        "http://localhost:8000/get_endpoint_stats/?index_name=iislogs_20241019_000003_968435df&endpoint=/"
      )
      .then((data) => {
        setEndpointKpiData(data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  // Endpointleri getir
  const getEndpointsFromELK = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/list_endpoints/?index_name=iislogs_20241019_000003_968435df"
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
    getIndicesFromApi();
    getEndpointsFromELK();
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
        <Input.Search size="large" placeholder="input here" />
      </AutoComplete>
      </div>
       
      <Collapse accordion items={items} />
    </div>

  )
}
export default CollapseStats;
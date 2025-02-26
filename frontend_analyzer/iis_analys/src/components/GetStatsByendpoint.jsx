import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { AutoComplete, Flex, Input, Button , Row, Col, Card } from 'antd';
import './index.css'
import axios from 'axios';



const Title = (props) => (
  <Flex align="center" justify="space-between">
    {props.title}
    <a href="https://www.google.com/search?q=antd" target="_blank" rel="noopener noreferrer">
      more
    </a>
  </Flex>
);
const renderItem = (title, count) => ({
  value: title,
  label: (
    <Flex align="center" justify="space-between">
      {title}
      <span>
        <UserOutlined /> {count}
      </span>
    </Flex>
  ),
});
const options = [
  {
    label: <Title title="Endpoints" />,
    options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
  }
];

const GetStatsByendpoint = () => {
  const [endpointKpiData, setEndpointKpiData] = useState(null);
  const [endpointOptions, setEndpointOptions] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  // Bu kısımda get isteği atıyoruz
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

  // Kart başlıkları ve veri anahtarları
  const cardTitles = [
    "GET sayısı", "POST sayısı", "Client Sayısı", "500'lü cevap sayısı",
    "200'lü cevap sayısı", "Min yanıt süresi", "Max yanıt süresi", "Ortalama yanıt süresi",
    "Standart sapma yanıt süresi", "Yapılan istek sayısı", "En çok istek yapılan tarih",
    "En çok istek yapılan datedeki max yanıt süresi", "En çok istek yapılan datedeki min yanıt süresi",
    "En çok istek yapılan datedeki ortalama yanıt süresi", "En çok istek yapılan datedeki standart sapma yanıt süresi",
    "En çok istek yapılan datedeki 500'lü cevap sayısı", "En çok istek yapılan datedeki 200'lü cevap sayısı",
    "yanıt süresi-max olan isteğin yapıldığı tarih", "yanıt süresi-max olan isteğin yapıldığı zaman",
    "yanıt süresi-max olan isteğe dönülen sc-status", "en çok istek atan IP",
    "Art arda verdiği 500'lü yanıt sayısı", "Art arda verdiği 500'lü yanıtlarının başlangıç tarihi ve saati"
  ];

  const dataKeys = [
    "GET_count", "POST_count", "unique_users_count", "status_codes_500_count", "status_codes_200_count",
    "min_time_taken", "max_time_taken", "avg_time_taken", "std_dev_time_taken", "total_requests_count",
    "most_requested_date", "max_time_taken_on_most_requested_date", "min_time_taken_on_most_requested_date",
    "avg_time_taken_on_most_requested_date", "std_dev_time_taken_on_most_requested_date",
    "status_codes_500_on_most_requested_date", "status_codes_200_on_most_requested_date",
    "max_time_taken_request_date", "max_time_taken_request_time", "max_time_taken_request_status",
    "most_frequent_ip", "consecutive_500s_count", "consecutive_500s_dates"
  ];

  return (
    <div className="centered-container-for-select-menu-on-top">
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
     
      <div className="card-kpi">
      <Row gutter={6}>
        {cardTitles.map((title, index) => (
          <Col span={6} key={index}> {/* Her kart 8 span alacak, 3 sütun olacak */}
            <Card title={title} bordered={true}>
              <div>
                {endpointKpiData && endpointKpiData[dataKeys[index]] !== undefined
                  ? typeof endpointKpiData[dataKeys[index]] === "string"
                    ? endpointKpiData[dataKeys[index]]
                    : endpointKpiData[dataKeys[index]]?.toString()
                  : "Veri Yok"}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
    </div>
  );
};

export default GetStatsByendpoint;
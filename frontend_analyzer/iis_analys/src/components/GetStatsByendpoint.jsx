import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Flex, Card, Row, Col } from 'antd';
import './index.css';
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
  },
];

const GetStatsByendpoint = ({ index_name, endpoint }) => {
  const [endpointKpiData, setEndpointKpiData] = useState(null);

  // API isteğini props'lardan alınan değerlere göre yap
  const getIndicesFromApi = async () => {
    if (index_name && endpoint) {
      try {
        const response = await axios.get(
          `http://localhost:8000/get_endpoint_stats/?index_name=${index_name}&endpoint=${endpoint}`
        );
        setEndpointKpiData(response.data);
      } catch (error) {
        console.error('API isteği sırasında hata oluştu:', error);
      }
    }
  };

  useEffect(() => {
    getIndicesFromApi();
  }, [index_name, endpoint]); // index_name ve endpoint değiştiğinde API isteğini tekrar yap

  const cardTitles = [
    'GET sayısı',
    'POST sayısı',
    'Client Sayısı',
    "500'lü cevap sayısı",
    "200'lü cevap sayısı",
    'Min yanıt süresi',
    'Max yanıt süresi',
    'Ortalama yanıt süresi',
    'Standart sapma yanıt süresi',
    'Yapılan istek sayısı',
    'En çok istek yapılan tarih',
    'En çok istek yapılan datedeki max yanıt süresi',
    'En çok istek yapılan datedeki min yanıt süresi',
    'En çok istek yapılan datedeki ortalama yanıt süresi',
    'En çok istek yapılan datedeki standart sapma yanıt süresi',
    "En çok istek yapılan datedeki 500'lü cevap sayısı",
    "En çok istek yapılan datedeki 200'lü cevap sayısı",
    'yanıt süresi-max olan isteğin yapıldığı tarih',
    'yanıt süresi-max olan isteğin yapıldığı zaman',
    'yanıt süresi-max olan isteğe dönülen sc-status',
    'en çok istek atan IP',
    'Art arda verdiği 500\'lü yanıt sayısı',
    'Art arda verdiği 500\'lü yanıtlarının başlangıç tarihi ve saati',
  ];

  const dataKeys = [
    'GET_count',
    'POST_count',
    'unique_users_count',
    'status_codes_500_count',
    'status_codes_200_count',
    'min_time_taken',
    'max_time_taken',
    'avg_time_taken',
    'std_dev_time_taken',
    'total_requests_count',
    'most_requested_date',
    'max_time_taken_on_most_requested_date',
    'min_time_taken_on_most_requested_date',
    'avg_time_taken_on_most_requested_date',
    'std_dev_time_taken_on_most_requested_date',
    'status_codes_500_on_most_requested_date',
    'status_codes_200_on_most_requested_date',
    'max_time_taken_request_date',
    'max_time_taken_request_time',
    'max_time_taken_request_status',
    'most_frequent_ip',
    'consecutive_500s_count',
    'consecutive_500s_dates',
  ];

  return (
    <div className="centered-container-for-select-menu-on-top">
      <div className="card-kpi">
        <Row gutter={6}>
          {cardTitles.map((title, index) => (
            <Col span={6} key={index}>
              <Card title={title} bordered={true}>
                <div>
                  {endpointKpiData && endpointKpiData[dataKeys[index]] !== undefined
                    ? typeof endpointKpiData[dataKeys[index]] === 'string'
                      ? endpointKpiData[dataKeys[index]]
                      : endpointKpiData[dataKeys[index]]?.toString()
                    : 'Veri Yok'}
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
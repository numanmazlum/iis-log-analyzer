import React, { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Flex, Card, Row, Col, List } from 'antd';
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
  }, [index_name, endpoint]);

  const cardTitles = [
    'GET sayısı',
    'POST sayısı',
    'Client Sayısı',
    "500'lü cevap sayısı",
    "200'lü cevap sayısı",
    'Minimum yanıt süresi (ms)',
    'Maksimum yanıt süresi (ms)',
    'Ortalama yanıt süresi (ms)',
    'Standart sapma yanıt süresi (ms)',
    'Yapılan istek sayısı',
    'En çok istek yapılan tarih',
    'En çok istek yapılan tarihteki max yanıt süresi (ms)',
    'En çok istek yapılan tarihteki min yanıt süresi (ms)',
    'En çok istek yapılan tarihteki ortalama yanıt süresi (ms)',
    'En çok istek yapılan tarihteki standart sapma yanıt süresi (ms)',
    "En çok istek yapılan tarihteki 500'lü cevap sayısı",
    "En çok istek yapılan tarihteki 200'lü cevap sayısı",
    'yanıt süresi-max olan isteğin yapıldığı tarih',
    'yanıt süresi-max olan isteğin yapıldığı saat',
    'yanıt süresi-max olan isteğe dönülen sc-status',
    'en çok istek atan IP',
    'Art arda verdiği 500\'lü yanıt sayısı'
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
    'consecutive_500s_count'
  ];

  return (
    <div className="centered-container-for-select-menu-on-top">
      <div className="card-kpi">
        <Row gutter={6}>
          {cardTitles.map((title, index) => (
            <Col span={80} key={index}>
              <Card title={title} bordered={true}>
                <div>
                  {endpointKpiData && endpointKpiData[dataKeys[index]] !== undefined
                    ? dataKeys[index] === 'consecutive_500s_data' // consecutive_500s_data özel durum
                      ? endpointKpiData[dataKeys[index]].length > 0
                        ? <List
                            dataSource={endpointKpiData[dataKeys[index]]}
                            renderItem={item => (
                              <List.Item>
                                Başlangıç: {item.start_time}, Bitiş: {item.end_time}
                              </List.Item>
                            )}
                          />
                        : 'Art arda 500 hatası yok'
                      : typeof endpointKpiData[dataKeys[index]] === 'string'
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
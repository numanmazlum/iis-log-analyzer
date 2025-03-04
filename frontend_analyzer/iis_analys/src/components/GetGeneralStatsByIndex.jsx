import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Row, Col, Typography, Table, Statistic, List, Spin, Empty } from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const { Title } = Typography;

function GetGeneralStatsByIndex({ index_name }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/get_general_stats/?index_name=${index_name}`);
        setStats(response.data);
      } catch (error) {
        console.error('API isteği sırasında hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }
    if (index_name) {
      fetchData();
    }
  }, [index_name]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><Spin size="large" /></div>;
  }

  if (!stats) {
    return <Empty description="Veri Yok" />;
  }

  const renderErrorRateTop10 = () => {
    const data = stats.error_rate_top_10.endpoints.buckets.map(item => ({
      name: item.key,
      hataOrani: item.error_requests.doc_count / item.total_requests.value,
    }));

    return (
      <Card title="Hata Oranı En Yüksek 10 Servis %">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(2)}%`} />
            <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
            <Legend />
            <Bar dataKey="hataOrani" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderErrorCountTop10 = () => {
    const data = stats.error_rate_top_10.endpoints.buckets.map(item => ({
      name: item.key,
      hataSayisi: item.error_requests.doc_count,
    }));
  
    return (
      <Card title="Hata Sayısı En Yüksek 10 Servis">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}`} />
            <Legend />
            <Bar dataKey="hataSayisi" fill="#377eb8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderResponseTimeTop20 = () => {
    const data = stats.response_time_top_20.endpoints.buckets.map(item => ({
      name: item.key,
      responseTime: item.avg_response_time.value/1000,
    }));

    return (
      <Card title="Yanıt Süresi En Yüksek 20 Servis Ortalama (saniye)">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="responseTime" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderMostRequestedTop10 = () => {
    const data = stats.most_requested_top_10.endpoints.buckets.slice(0, 10).map(item => ({ // İlk 10 endpoint'i al
      name: item.key,
      istekSayısı: item.doc_count,
    }));
  
    const colors = [
      '#FF6384', // Kırmızı tonları
      '#36A2EB', // Mavi tonları
      '#FFCE56', // Sarı tonları
      '#4BC0C0', // Yeşil tonları
      '#9966FF', // Mor tonları
      '#FF9F40', // Turuncu tonları
      '#808080', // Gri tonları
      '#008080', // Teal tonları
      '#800080', // Mor tonları
      '#000080', // Lacivert tonları
    ];
  
    return (
      <Card title="En Çok İstek Alan Servisler">
        <ResponsiveContainer width="100%" height={450}> {/* Yüksekliği artır */}
          <PieChart>
            <Pie
              data={data}
              dataKey="istekSayısı"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120} // Yarıçapı artır
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderErrorClientIpsTop5 = () => {
    const columns = [
      { title: 'IP', dataIndex: 'key', key: 'key' },
      { title: 'Hata Sayısı', dataIndex: 'doc_count', key: 'doc_count' },
    ];
    return <Card title="En Çok Hata Alan İstemci IP'leri"><Table dataSource={stats.error_client_ips_top_5.client_ips.buckets} columns={columns} pagination={false} /></Card>;
  };

  const renderResponseTimeClientIpsTop5 = () => {
    const columns = [
      { title: 'IP', dataIndex: 'key', key: 'key' },
    ];
    return <Card title="En Yüksek Ortalama Yanıt Süresine Sahip 5 İstemci IP'si"><Table dataSource={stats.response_time_client_ips_top_5.client_ips.buckets} columns={columns} pagination={false} /></Card>;
  };

  const renderUserAgentsTop10 = () => {
    const columns = [
      { title: 'User Agent', dataIndex: 'key', key: 'key' },
      { title: 'Sayı', dataIndex: 'doc_count', key: 'doc_count' },
    ];
    return <Card title="En Çok Kullanılan Kullanıcı Aracıları (User-Agent)"><Table dataSource={stats.user_agents_top_10.user_agents.buckets} columns={columns} pagination={false} /></Card>;
  };

  const renderHttpMethods = () => {
    const data = stats.http_methods.http_methods.buckets.map(item => ({
      name: item.key,
      count: item.doc_count,
    }));
  
    const colors = [
      '#66b3ff', // Açık mavi
      '#99ff99', // Açık yeşil
      '#ffcc99', // Açık turuncu
      '#c2c2f0', // Açık mor
      '#ffb3e6', // Açık pembe
      '#e6e600', // Açık sarı
    ];
  
    return (
      <Card title="En Çok Kullanılan HTTP Metotları">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100} 
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    );
  };

  const renderErrorRateOverTime = () => {
    const data = stats.error_rate_over_time.error_rate_over_time.buckets.map(item => ({
      time: item.key_as_string.substring(0, 10),
      hataOrani: item.error_requests.doc_count / item.total_requests.value,
    }));

    return (
      <Card title="Zaman İçinde Hata Oranı Değişimi">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis tickFormatter={(value) => `${(value * 100).toFixed(2)}%`} />
            <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
            <Legend />
            <Line type="monotone" dataKey="hataOrani" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    );
  };

 

  return (
    <div>
      <Row gutter={[16, 16]}>
      <Col span={24}>{renderErrorCountTop10()}</Col>
        <Col span={12}>{renderErrorRateTop10()}</Col>
        <Col span={12}>{renderResponseTimeTop20()}</Col>
        <Col span={12}>{renderMostRequestedTop10()}</Col>
        <Col span={12}>{renderErrorClientIpsTop5()}</Col>
        <Col span={12}>{renderResponseTimeClientIpsTop5()}</Col>
        <Col span={12}>{renderUserAgentsTop10()}</Col>
        <Col span={12}>{renderHttpMethods()}</Col>
        <Col span={24}>{renderErrorRateOverTime()}</Col>
       
      </Row>
    </div>
  );
}

export default GetGeneralStatsByIndex;
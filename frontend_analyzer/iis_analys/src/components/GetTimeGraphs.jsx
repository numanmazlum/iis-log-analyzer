import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, Spin } from 'antd'; // Ant Design'dan Card ve Spin bileşenlerini ekledim

const GetTimeGraphs = ({ index_name, endpoint }) => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [loading, setLoading] = useState(true); // Yükleme durumunu izlemek için state ekledim

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Yükleme başladı
      try {
        const response = await axios.get(
          `http://localhost:8000/get_time_based_stats/?index_name=${index_name}&endpoint=${endpoint}`
        );
        setTimeSeriesData(response.data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      } finally {
        setLoading(false); // Yükleme tamamlandı
      }
    };

    fetchData();
  }, [index_name, endpoint]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Card title="Endpoint Bazında Genel Tarih-Status Code Grafiği">
        <LineChart width={800} height={300} data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="durum_500_count" stroke="#8884d8" name="500 Kodları" />
          <Line type="monotone" dataKey="durum_200_count" stroke="#82ca9d" name="200 Kodları" />
        </LineChart>
      </Card>

      <Card title="Endpoint Bazında Tarih-Yanıt Süreleri">
        <LineChart width={800} height={300} data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ortalama_time_taken" stroke="#ffc658" name="Ortalama Yanıt Süresi" />
          <Line type="monotone" dataKey="max_time_taken" stroke="#8884d8" name="Max Yanıt Süresi" />
          <Line type="monotone" dataKey="min_time_taken" stroke="#82ca9d" name="Min Yanıt Süresi" />
        </LineChart>
      </Card>

      <Card title="Endpoint bazında 500 Kodları">
        <LineChart width={800} height={300} data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="durum_500_count" stroke="#8884d8" name="500 Kodları" />
        </LineChart>
      </Card>

      <Card title="Endpoint Bazında Ort-Max Yanıt Süreleri Karşılaştırması">
        <LineChart width={800} height={300} data={timeSeriesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ortalama_time_taken" stroke="#ffc658" name="Ortalama Yanıt Süresi" />
          <Line type="monotone" dataKey="max_time_taken" stroke="#8884d8" name="Max Yanıt Süresi" />
        </LineChart>
      </Card>
    </div>
  );
};

export default GetTimeGraphs;
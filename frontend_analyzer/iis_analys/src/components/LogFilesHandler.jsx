import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message, Popconfirm, Spin, Alert } from 'antd';
import { DeleteOutlined, AreaChartOutlined } from '@ant-design/icons';
const LogFilesHandler = () => {
  const [fileIndexPairs, setFileIndexPairs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(
    localStorage.getItem('selectedIndex') || null
  );
  const [selectedFileName, setSelectedFileName] = useState(
    localStorage.getItem('selectedFileName') || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFileIndexPairs();
  }, []);

  const fetchFileIndexPairs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8000/get_all_file_index_pairs/');
      setFileIndexPairs(response.data.file_index_pairs);
    } catch (err) {
      setError('Dosya listesi alınırken bir hata oluştu.');
      console.error('Dosya listesi hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = (record) => {
    localStorage.setItem('selectedIndex', record.index_name);
    localStorage.setItem('selectedFileName',record.file_name)
    setSelectedIndex(record.index_name);
    setSelectedFileName(record.file_name);
    message.success(`"${selectedFileName}" dosyası analiz için seçildi.`);
  };

  const handleDelete = async (record) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:8000/delete_file/${record.file_name}`);
      message.success(`"${record.file_name}" dosyası başarıyla silindi.`);
      fetchFileIndexPairs();
    } catch (err) {
      setError(`"${record.file_name}" dosyası silinirken bir hata oluştu.`);
      console.error('Dosya silme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: 'Dosya Adı', dataIndex: 'file_name', key: 'file_name' },
    { title: 'Index Adı', dataIndex: 'index_name', key: 'index_name' },
    {
      title: 'İşlemler',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button
            type="primary"
            icon={<AreaChartOutlined />}
            onClick={() => handleAnalyze(record)}
            style={{ marginRight: '8px' }}
          >
            Analiz İçin Seç
          </Button>
          <Popconfirm
            title={`"${record.file_name}" dosyasını silmek istediğinize emin misiniz?`}
            onConfirm={() => handleDelete(record)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Sil
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      {loading && <Spin tip="Yükleniyor..." />}
      {error && <Alert message={error} type="error" style={{ marginBottom: '16px' }} />}
      {selectedIndex && (
        <Alert
          message={`Analiz için Seçilen Dosya: ${selectedFileName}`}
          type="info"
          style={{ marginBottom: '16px' }}
        />
      )}
      <Table dataSource={fileIndexPairs} columns={columns} rowKey="index_name" />
    </div>
  );
};

export default LogFilesHandler;
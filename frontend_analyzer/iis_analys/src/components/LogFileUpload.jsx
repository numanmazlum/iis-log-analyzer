import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Button, message, Spin, Alert, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const LogFileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [parseMessage, setParseMessage] = useState(null);
  const [saveMessage, setSaveMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [indexName, setIndexName] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (info) => {
    if (info.file.name.endsWith("log")) {
      setFile(info.file);
      console.log('Dosya seçildi:', info.file);
    } else if (info.file.status === 'removed') {
      setFile(null);
      console.log('Dosya kaldırıldı.');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      message.error('Lütfen bir dosya seçin.');
      return;
    }

    setLoading(true);
    setUploadMessage({ type: 'info', text: 'Dosya yükleniyor...' });
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('uploaded_file', file);
      console.log('Yüklenen dosya:', file.name);

      // Dosyayı yükle
      const uploadResponse = await axios.post('http://localhost:8000/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      console.log('Dosya yükleme başarılı:', uploadResponse.data);
      setUploadMessage({
        type: 'success',
        text: `Dosya başarıyla içe aktarıldı: ${uploadResponse.data.filename}`,
      });

      // Dosyayı parse et
      setParseMessage({ type: 'info', text: 'Dosya ayrıştırılıyor..' });
      const parseResponse = await axios.post('http://localhost:8000/parse_file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Dosya analiz başarılı:', parseResponse.data);
      setParseMessage({
        type: 'success',
        text: `Dosya başarıyla ayrıştırıldı: ${parseResponse.data.file_name}`,
      });

      // Veriyi Elasticsearch'e kaydet
      setSaveMessage({ type: 'info', text: 'Veri Elasticsearch\'e kaydediliyor... (Dosya boyutuna göre bekleme süresi uzayabilir)' });
      const saveResponse = await axios.post('http://localhost:8000/save_to_es/', parseResponse.data);

      console.log('Veri Elasticsearch\'e kaydedildi:', saveResponse.data);
      setSaveMessage({
        type: 'success',
        text: `Veri Elasticsearch'e başarıyla kaydedildi. Index Adı: ${saveResponse.data.index_name}`,
      });
      setIndexName(saveResponse.data.index_name);

    } catch (error) {
      console.error('Hata oluştu:', error);
      setErrorMessage({ type: 'error', text: `Hata oluştu: ${error.message}` });
      setUploadMessage(null);
      setParseMessage(null);
      setSaveMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Upload beforeUpload={() => false} onChange={handleFileChange} maxCount={1}>
        <Button icon={<UploadOutlined />}>Dosya Seç</Button>
      </Upload>
      <Button type="primary" onClick={handleUpload} disabled={!file || loading} style={{ marginTop: '16px' }}>
        Yükle ve Analiz Et
      </Button>

      {loading && (
        <>
          <Spin tip="Yükleniyor..." style={{ marginTop: '16px' }} />
          <Progress percent={uploadProgress} style={{ marginTop: '8px' }} />
        </>
      )}

      {uploadMessage && (
        <Alert message={uploadMessage.text} type={uploadMessage.type} style={{ marginTop: '16px' }} />
      )}

      {parseMessage && (
        <Alert message={parseMessage.text} type={parseMessage.type} style={{ marginTop: '16px' }} />
      )}

      {saveMessage && (
        <Alert message={saveMessage.text} type={saveMessage.type} style={{ marginTop: '16px' }} />
      )}

      {errorMessage && (
        <Alert message={errorMessage.text} type={errorMessage.type} style={{ marginTop: '16px' }} />
      )}

      {indexName && (
        <Alert message={`Index Adı: ${indexName}`} type="info" style={{ marginTop: '16px' }} />
      )}
    </div>
  );
};

export default LogFileUpload;
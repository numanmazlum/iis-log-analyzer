# IIS Log Analiz ve Görselleştirme Projesi

## Proje Hakkında

IIS loglarını analiz etmek ve görselleştirmek amacıyla geliştirilmiş bir uygulamadır. İçeri aktarılan .log dosyalarını analiz edip görselleştirir.



## Kullanılan Teknolojiler

* **FastAPI (Python)** 
* **React Vite** 
* **Elasticsearch** 

## Kurulum Adımları

### 1. Docker ile Kurulum

**Önemli Not: Docker ile kurulumda react vite tarayıcıda çalışmayabilir** 

Projenin tüm bileşenleri Docker Compose ile tek bir komutla başlatılabilir. Docker Compose, tüm servisleri (backend, frontend, ve Elasticsearch) bir arada çalıştırmak için kullanılır.

**Adımlar:**

    docker-compose up --build

Bu komut, frontend, backend ve Elasticsearch servislerini başlatacaktır.
  
  
  **Frontend:** `http://localhost:5173/` adresinden erişebilirsiniz.
  
  **Backend:** API'ye `http://localhost:8000/` üzerinden erişebilirsiniz.
  
  **Elasticsearch:** Elasticsearch veritabanına `http://localhost:9200/` adresinden erişebilirsiniz.
    

### 2. Manuel Kurulum

Eğer Docker kullanmak istemiyorsanız, her bir bileşeni manuel olarak kurabilirsiniz.

**Backend Kurulumu (FastAPI):**

1.  **Python ve Gereksinimler:**
    * Backend için gerekli Python kütüphanelerini yüklemek için, `requirements.txt` dosyasını kullanabilirsiniz. Aşağıdaki komut ile gerekli bağımlılıkları kurun:
  
     
       ```bash
        pip install -r requirements.txt
       ```
  
2.  **FastAPI Sunucusunu Başlatın:**
    * Backend uygulamasını başlatmak için terminalde şu komutu çalıştırın:

    ```bash
    uvicorn app.main:app --reload
    ```

    * Bu komut ile FastAPI sunucusu çalışmaya başlayacaktır ve `http://localhost:8000/` adresinden API'ye erişebilirsiniz.

    **Frontend Kurulumu (React Vite):**
    
      **React Vite Uygulamasını Başlatın:**
        * Frontend dizinine gidin ve aşağıdaki komutları sırayla çalıştırarak gerekli bağımlılıkları yükleyin:
    
        ```bash
        npm install
        ```
    
    3.  **Frontend Uygulamasını Başlatın:**
       * Uygulamayı çalıştırmak için:
    
        ```bash
        npm run dev
        ```

**Elasticsearch Kurulumu:**

1.  **Elasticsearch Kurulumu:**
    * Elasticsearch'ü [resmi sitesinden](https://www.elastic.co/downloads/elasticsearch) indirin.
    * İndirdiğiniz dosyayı açın ve Elasticsearch'ü başlatın:

    ```bash
    ./bin/elasticsearch
    ```

    * Bu komut ile Elasticsearch, `http://localhost:9200/` adresinde çalışmaya başlayacaktır.


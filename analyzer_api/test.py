import os
import json
import pandas as pd
import requests
import httpx

UPLOAD_DIR="uploads"
ELASTICSEARCH_URL="http://localhost:9200"
def parse_log_file(uploaded_file):
    software_type=""
    version=""
    created_date=""
    created_time=""
    table_columns=""
    try:
        # Dosyanın gerçekten bir dosya olduğundan ve .log uzantısı içerdiğinden emin olun
        if os.path.isfile(uploaded_file) and uploaded_file.endswith(".log"):  # Uzantıyı ihtiyaca göre değiştirin
            try:
                # UTF-8 ile dosyayı açmayı deniyoruz
                with open(uploaded_file, 'r', encoding='utf-8') as file:
                    lines = file.readlines()
            except UnicodeDecodeError:
                # Eğer UTF-8 hata verirse, UTF-16 ile tekrar açmayı deniyoruz
                with open(uploaded_file, 'r', encoding='utf-16') as file:
                    lines = file.readlines()
            software_type = lines[0].strip('#Software: ').split('\n')[0]
            version=lines[1].strip('#Version: ').split('\n')[0]
            created_date,created_time=lines[2].strip('#Date: ').split()[0],lines[2].strip('#Date: ').split()[1]
            table_columns=lines[3].strip().split()[1:]
            table_columns={
                "date":table_columns[0],
                "time":table_columns[1],
                "s_ip":table_columns[2],
                "cs_method":table_columns[3],
                "cs_uri_stem":table_columns[4],
                "cs_uri_query":table_columns[5],
                "s_port":table_columns[6],
                "cs_username":table_columns[7],
                "c_ip":table_columns[8],
                "cs_user_agent":table_columns[9],
                "cs_referer":table_columns[10],
                "sc_status":table_columns[11],
                "sc_substatus":table_columns[12],
                "sc_wint32_status":table_columns[13],
                "time_taken":table_columns[14],
                "x_forwarded_for":table_columns[15],
            }
            rows=[line.strip().split() for line in lines[4:]]
            columns=list(table_columns.keys())
            df=pd.DataFrame(data=rows,columns=columns)

        result={
                "software_type":software_type,
                "version":version,
                "createad_date":created_date,
                "created_time":created_time,
                "dataframe":df
            }
        return result
    except Exception as e :
        print(e)


async def get_kpi(index_name: str, endpoint: str):
    elastic_query = {
        "size": 0,
        "query": {
            "term": {
                "cs_uri_stem.keyword": endpoint
            }
        },
        "aggs": {
            "http_methods": {
                "terms": {
                    "field": "cs_method.keyword",
                    "size": 2
                }
            },
            "unique_users": {
                "cardinality": {
                    "field": "cs_username.keyword"
                }
            },
            "status_codes": {
                "terms": {
                    "field": "sc_status",
                    "size": 2
                }
            },
            "time_taken_stats": {
                "extended_stats": {
                    "field": "time_taken"
                }
            },
            "top_date": {
                "terms": {
                    "field": "date",
                    "size": 1,
                    "order": {"_count": "desc"}
                },
                "aggs": {
                    "date_time_taken_stats": {
                        "extended_stats": {
                            "field": "time_taken"
                        }
                    },
                    "date_status_codes": {
                        "terms": {
                            "field": "sc_status"
                        }
                    }
                }
            },
            "time_taken_max_details": {
                "top_hits": {
                    "sort": [
                        {"time_taken": {"order": "desc"}}
                    ],
                    "_source": {
                        "includes": ["date", "time", "time_taken", "sc_status", "c_ip"]
                    },
                    "size": 1
                }
            },
            "most_frequent_ip": {
                "terms": {
                    "field": "c_ip.keyword",
                    "size": 1
                }
            },
            "consecutive_500s": {
                "filter": {
                    "term": {"sc_status": 500}
                },
                "aggs": {
                    "consecutive_500_times": {
                        "date_histogram": {
                            "field": "date",
                            "fixed_interval": "1d",
                            "min_doc_count": 1
                        }
                    }
                }
            }
        }
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{ELASTICSEARCH_URL}/{index_name}/_search",
            headers={"Content-Type": "application/json"},
            json=elastic_query  # `json` parametresi ile JSON olarak gönder
        )

    return response.json()  # JSON formatında döndür


print(get_kpi("iislogs_20241019_000003_454a156b","/"))


# uploaded_file=("uploads/ornek1iis.log")

# print(parse_log_file(uploaded_file))
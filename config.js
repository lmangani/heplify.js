{
  "id" : "HEPop101",
  "socket": "http",
  "port": 8080,
  "address": "127.0.0.1",
  "tls": {
    "key":"/etc/keys/self.key",
    "cert":"/etc/keys/self.crt"
  },
  "queue": {
    "timeout": 2000,
    "maxSize": 1000,
    "useInterval": true
  },
  "dbName": "hepic",
  "tableName": "hep",
  "db": {
	"rawSize": 8000,
	"loki" : {
	  "url": "http://127.0.0.1:3100/api/prom/push"
  	}
  },
  "metrics": {
	"influx":{
		"period": 30000,
		"expire": 300000,
		"dbName": "homer",
		"hostname": "localhost:8086"
	}
  },
  "debug": false
}

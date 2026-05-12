import http from 'k6/http';
import { sleep, check } from 'k6';


export const options = {
  scenarios: {
   
    read_heavy: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
      exec: 'readIncidents',
    },
    
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 50 }, // فجأة 50 مستخدم
        { duration: '10s', target: 0 },
      ],
      exec: 'mixedWorkload',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1500'], // شرط النجاح: 95% من الطلبات تحت 1.5 ثانية
    http_req_failed: ['rate<0.01'],   // شرط النجاح: نسبة الخطأ أقل من 1%
  },
};


export function readIncidents() {
  const res = http.get('http://localhost:3000/api/v1/external/city-info?city=Ramallah');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}


export function mixedWorkload() {
  http.get('http://localhost:3000/api/v1/external/city-info?city=Nablus');
  
  sleep(1);
}
// 1. init code
import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { scenario } from 'k6/execution';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
const baseUrl = 'http://localhost:3000/users';
const userData = JSON.parse(open('./userLoadData.json'));

export const options = {
  teardownTimeout: '10m',
  scenarios: {
    // https://k6.io/docs/test-types/smoke-testing/
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
    //
    // https://k6.io/docs/test-types/load-testing/
    // load: {
    //   executor: 'ramping-vus',
    //   startVUs: 0,
    //   stages: [
    //     { duration: '5m', target: 100 }, // ramp up to 100 VUs over 5 minutes
    //     { duration: '10m', target: 100 }, // consistently 100 VUs for 10 minutes
    //     { duration: '5m', target: 0 }, // ramp down to 0 VUs over 5 minutes
    //   ],
    // },
    //
    // https://k6.io/docs/test-types/stress-testing/
    // stress: {
    //   executor: 'ramping-vus',
    //   startVUs: 0,
    //   stages: [
    //     { duration: '2m', target: 100 }, // below normal load
    //     { duration: '5m', target: 100 },
    //     { duration: '2m', target: 200 }, // normal load
    //     { duration: '5m', target: 200 },
    //     { duration: '2m', target: 300 }, // around the breaking point
    //     { duration: '5m', target: 300 },
    //     { duration: '2m', target: 400 }, // beyond the breaking point
    //     { duration: '5m', target: 400 },
    //     { duration: '10m', target: 0 }, // scale down. Recovery stage.
    //   ],
    // },
    //
    // https://k6.io/docs/test-types/stress-testing/#spike-testing-in-k6
    // spike: {
    //   executor: 'ramping-vus',
    //   startVUs: 0,
    //   stages: [
    //     { duration: '10s', target: 100 }, // below normal load
    //     { duration: '1m', target: 100 },
    //     { duration: '10s', target: 1400 }, // spike to 1400 users
    //     { duration: '3m', target: 1400 }, // stay at 1400 for 3 minutes
    //     { duration: '10s', target: 100 }, // scale down. Recovery stage.
    //     { duration: '3m', target: 100 },
    //     { duration: '10s', target: 0 },
    //   ],
    // },
    //
    // https://k6.io/docs/test-types/soak-testing/
    // soak: {
    //   executor: 'ramping-vus',
    //   startVUs: 0,
    //   stages: [
    //     { duration: '2m', target: 400 }, // ramp up to 400 users
    //     { duration: '3h56m', target: 400 }, // stay at 400 for ~4 hours
    //     { duration: '2m', target: 0 }, // scale down. (optional)
    //   ],
    // },
  },
  thresholds: {
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'], // 90% of requests must finish within 400ms, 95% within 800, and 99.9% within 2s.
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    'http_req_duration{name:createUser}': ['p(95)<800'], // threshold on createUser requests only
    'http_req_duration{name:login}': ['p(95)<800'], // threshold on login requests only
    'http_req_duration{name:updateUser}': ['p(95)<800'], // threshold on updateUser requests only
    'http_req_duration{name:getAllUsers}': ['p(95)<800'], // threshold on getAllUsers requests only
    'http_req_duration{name:deleteUser}': ['p(95)<800'], // threshold on deleteUser requests only
    'checks{tag:createUser}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'checks{tag:login}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:updateUser}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:getAllUsers}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:deleteUser}': ['rate>0.95'], // rate of successful checks should be higher than 95%
  },
};

const SLEEP_DURATION = 1;

export default function (_) {
  group('user journey', (_) => {
    // create user
    let user = userData['user'][scenario.iterationInTest];

    let createUserRes = http.post(`${baseUrl}`, user, { tags: { name: 'createUser' } });
    user.id = createUserRes.json()['id'];

    check(
      createUserRes,
      {
        'createUser returns status 200': (r) => r.status === 200,
        'createUser returns ID': (r) => r.json().hasOwnProperty('id'),
        'createUser returns no error': (r) => r.error === '',
      },
      { tag: 'createUser' }
    );

    sleep(SLEEP_DURATION);

    // login
    let loginBody = {
      email: user.email,
      password: user.password,
    };

    let loginRes = http.post(`${baseUrl}/auth`, loginBody, { tags: { name: 'login' } });
    user.token = loginRes.json()['token'];

    check(
      loginRes,
      {
        'login returns status 200': (r) => r.status === 200,
        'login returns token': (r) => r.json().hasOwnProperty('token'),
        'login returns no error': (r) => r.error === '',
      },
      { tag: 'login' }
    );

    sleep(SLEEP_DURATION);

    let params = {
      headers: {
        Authorization: user.token,
      },
    };

    // update user
    let updateBody = {
      firstName: user.firstName,
      lastName: 'K6-TEST-EDITED',
      email: user.email,
      password: user.password,
    };

    const updateRes = http.put(`${baseUrl}/${user.id}`, updateBody, {
      tags: { name: 'updateUser' },
      headers: params.headers,
    });

    check(
      updateRes,
      {
        'update returns status 204': (r) => r.status === 204,
        'update returns no data in body': (r) => r.body === '',
        'update returns no error': (r) => r.error === '',
      },
      { tag: 'updateUser' }
    );

    sleep(SLEEP_DURATION);

    // get users
    const getRes = http.get(`${baseUrl}`, {
      tags: { name: 'getAllUsers' },
      headers: params.headers,
    });

    check(
      getRes,
      {
        'get returns status 200': (r) => r.status === 200,
        'get returns a list of users': (r) => r.json() && r.json()['users'].length > 0,
        'get returns no error': (r) => r.error === '',
      },
      { tag: 'getAllUsers' }
    );

    sleep(SLEEP_DURATION);

    // delete
    const deleteRes = http.del(`${baseUrl}/${user.id}`, null, {
      tags: { name: 'deleteUser' },
      headers: params.headers,
    });

    check(
      deleteRes,
      {
        'delete returns status 204': (r) => r.status === 204,
        'delete returns no data in body': (r) => r.body === '',
        'delete returns no error': (r) => r.error === '',
      },
      { tag: 'deleteUser' }
    );

    sleep(SLEEP_DURATION);
  });
}

export function handleSummary(data) {
  return {
    './tests/k6/summary.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

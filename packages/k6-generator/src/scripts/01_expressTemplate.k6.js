import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import { vu } from 'k6/execution';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
const SLEEP_DURATION = 1;
const uniqueData = new SharedArray('user', function () {
  return JSON.parse(open('../../../../unique/user.json')).user;
});

export const options = {
  teardownTimeout: '2m',
  scenarios: {
    // https://k6.io/docs/test-types/smoke-testing/
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '20s',
    },
    //
    // https://k6.io/docs/test-types/load-testing/
    // load: {
    //   executor: "ramping-vus",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "5m", target: 100 }, // ramp up to 100 VUs over 5 minutes
    //     { duration: "10m", target: 100 }, // consistently 100 VUs for 10 minutes
    //     { duration: "5m", target: 0 }, // ramp down to 0 VUs over 5 minutes
    //   ],
    // },
    //
    // https://k6.io/docs/test-types/stress-testing/
    // stress: {
    //   executor: "ramping-vus",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "2m", target: 100 }, // below normal load
    //     { duration: "5m", target: 100 },
    //     { duration: "2m", target: 200 }, // normal load
    //     { duration: "5m", target: 200 },
    //     { duration: "2m", target: 300 }, // around the breaking point
    //     { duration: "5m", target: 300 },
    //     { duration: "2m", target: 400 }, // beyond the breaking point
    //     { duration: "5m", target: 400 },
    //     { duration: "10m", target: 0 }, // scale down. Recovery stage.
    //   ],
    // },
    //
    // https://k6.io/docs/test-types/stress-testing/#spike-testing-in-k6
    // spike: {
    //   executor: "ramping-vus",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "10s", target: 100 }, // below normal load
    //     { duration: "1m", target: 100 },
    //     { duration: "10s", target: 1400 }, // spike to 1400 users
    //     { duration: "3m", target: 1400 }, // stay at 1400 for 3 minutes
    //     { duration: "10s", target: 100 }, // scale down. Recovery stage.
    //     { duration: "3m", target: 100 },
    //     { duration: "10s", target: 0 },
    //   ],
    // },
    //
    // https://k6.io/docs/test-types/soak-testing/
    // soak: {
    //   executor: "ramping-vus",
    //   startVUs: 0,
    //   stages: [
    //     { duration: "2m", target: 400 }, // ramp up to 400 users
    //     { duration: "3h56m", target: 400 }, // stay at 400 for ~4 hours
    //     { duration: "2m", target: 0 }, // scale down. (optional)
    //   ],
    // },
  },
  thresholds: {
    http_req_duration: ['p(90) < 800', 'p(95) < 900', 'p(99.9) < 1000'], // 90% of requests must finish within 700ms, 95% within 800, and 99.9% within 1s.
    http_req_failed: ['rate<0.05'], // http errors should be less than 5%

    'http_req_duration{name:createUser}': ['p(95)<800'], // threshold on createUser requests only
    'checks{tag:createUser}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userLogin}': ['p(95)<800'], // threshold on userLogin requests only
    'checks{tag:userLogin}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:editUser}': ['p(95)<800'], // threshold on editUser requests only
    'checks{tag:editUser}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:getAllUsers}': ['p(95)<800'], // threshold on getAllUsers requests only
    'checks{tag:getAllUsers}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:deleteUser}': ['p(95)<800'], // threshold on deleteUser requests only
    'checks{tag:deleteUser}': ['rate>0.99'], // rate of successful checks should be higher than 99%_CHECKS,
  },
};

export default function () {
  const vuObj = {
    email: 'test@24g.com',
    password: '24GP@ssword368',
    firstName: 'Alpha',
    lastName: 'Test',
    id: '2018f80c-aa83-4d3b-94b0-e872df158cf3',
  };

  const params = {
    headers: {},
  };

  let reqBody = {};
  let payload = [];
  let tagName;

  const saveIds = (tagName, tag) => {
    if (tagName === 'challengesAllRes' && !vuObj.challengeId && tag.json().challenges) {
      vuObj.challengeId = tag.json().challenges[0].id;
    } else if (tagName === 'classroomDashRes' && !vuObj.classroomId && tag.json().classrooms) {
      vuObj.classroomId = tag.json().classrooms[0].id;
    } else if (tagName === 'pollsAllRes' && !vuObj.pollId && tag.json().polls) {
      vuObj.pollId = tag.json().polls[0].id;
    } else if (tagName === 'storeAllItemsRes' && !vuObj.itemId && tag.json().items) {
      vuObj.itemId = tag.json().items[0].id;
    }
  };

  const parsePayload = (uniquePayload) => {
    if (!uniquePayload) {
      payload.forEach((item) => {
        reqBody[item] = vuObj[item];
      });
    } else {
      reqBody = uniqueData[vu.idInTest - 1];
      Object.keys(reqBody).forEach((key) => {
        vuObj[key] = reqBody[key];
      });
    }
  };

  payload = ['email', 'firstName', 'lastName', 'password'];
  if (true) {
    parsePayload(true);
  }
  payload = [];
  tagName = 'createUserRes';
  const createUserRes =
    reqBody && Object.keys(reqBody).length >= 1
      ? http.post('http://localhost:3000/users', reqBody, {
          tags: { name: 'createUser' },
          headers: false ? params.headers : null,
        })
      : http.post('http://localhost:3000/users', null, {
          tags: { name: 'createUser' },
          headers: false ? params.headers : null,
        });

  check(
    createUserRes,
    {
      ['post - /users returns successful status']: (r) => r.status === 200 || r.status === 204,
      ['post - /users returns valid body']: (r) =>
        r.status === 204 ? true : r.json().hasOwnProperty('id'),
      ['post - /users returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'createUser' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  vuObj.id = createUserRes.json()['id'];

  payload = ['email', 'password'];
  if (true) {
    parsePayload(false);
  }
  payload = [];
  tagName = 'userLoginRes';
  const userLoginRes =
    reqBody && Object.keys(reqBody).length >= 1
      ? http.post('http://localhost:3000/users/auth', reqBody, {
          tags: { name: 'userLogin' },
          headers: false ? params.headers : null,
        })
      : http.post('http://localhost:3000/users/auth', null, {
          tags: { name: 'userLogin' },
          headers: false ? params.headers : null,
        });

  check(
    userLoginRes,
    {
      ['post - /users/auth returns successful status']: (r) => r.status === 200 || r.status === 204,
      ['post - /users/auth returns valid body']: (r) =>
        r.status === 204 ? true : r.json().hasOwnProperty('token'),
      ['post - /users/auth returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userLogin' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  vuObj.token = userLoginRes.json()['token'];
  params.headers['Authorization'] = vuObj.token;

  payload = ['email', 'firstName', 'lastName', 'password'];
  if (true) {
    parsePayload(false);
  }
  payload = [];
  tagName = 'editUserRes';
  const editUserRes =
    reqBody && Object.keys(reqBody).length >= 1
      ? http.put(`http://localhost:3000/users/${vuObj['id']}`, reqBody, {
          tags: { name: 'editUser' },
          headers: true ? params.headers : null,
        })
      : http.put(`http://localhost:3000/users/${vuObj['id']}`, {
          tags: { name: 'editUser' },
          headers: true ? params.headers : null,
        });

  check(
    editUserRes,
    {
      ['put - /users/${id} returns successful status']: (r) => r.status === 200 || r.status === 204,
      ['put - /users/${id} returns valid body']: (r) =>
        r.status === 204 ? true : r.json().hasOwnProperty(''),
      ['put - /users/${id} returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'editUser' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'getAllUsersRes';
  const getAllUsersRes = http.get(`http://localhost:3000/users?limit=10&offset=0`, {
    tags: { name: 'getAllUsers' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, getAllUsersRes);

  check(
    getAllUsersRes,
    {
      ['get - /users?limit=10&offset=0 returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /users?limit=10&offset=0 returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('users')
          : JSON.stringify(r.body).includes('null'),
      ['get - /users?limit=10&offset=0 returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'getAllUsers' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  payload = undefined;
  if (undefined) {
    parsePayload(undefined);
  }
  payload = [];
  tagName = 'deleteUserRes';
  const deleteUserRes =
    reqBody && Object.keys(reqBody).length >= 1
      ? http.del(`http://localhost:3000/users/${vuObj['id']}`, reqBody, {
          tags: { name: 'deleteUser' },
          headers: true ? params.headers : null,
        })
      : http.del(`http://localhost:3000/users/${vuObj['id']}`, null, {
          tags: { name: 'deleteUser' },
          headers: true ? params.headers : null,
        });

  check(
    deleteUserRes,
    {
      ['delete - /users/${id} returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['delete - /users/${id} returns valid body']: (r) =>
        r.status === 204 ? true : r.json().hasOwnProperty(''),
      ['delete - /users/${id} returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'deleteUser' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  vuObj['id'] = null;
  vuObj['token'] = null;
}

export function handleSummary(data) {
  return {
    './packages/k6-generator/src/reports/expressTemplate.summary.1651180134.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

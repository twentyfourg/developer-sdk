import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const lxpData = JSON.parse(open('./lxpMethods.json'));
const baseUrl = lxpData['baseUrl'];
const SLEEP_DURATION = lxpData['sleep'];

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
    http_req_duration: ['p(90) < 800', 'p(95) < 900', 'p(99.9) < 1000'], // 90% of requests must finish within 700ms, 95% within 800, and 99.9% within 1s.
    http_req_failed: ['rate<0.05'], // http errors should be less than 5%

    'http_req_duration{name:userProfile}': ['p(95)<800'], // threshold on userProfile requests only
    'http_req_duration{name:userLogin}': ['p(95)<800'], // threshold on login requests only
    'http_req_duration{name:userConnections}': ['p(95)<800'], // threshold on userConnections requests only
    'http_req_duration{name:userClassrooms}': ['p(95)<800'], // threshold on userClassrooms requests only
    'http_req_duration{name:userClassroomsLink}': ['p(95)<800'], // threshold on userClassroomsLink requests only
    'http_req_duration{name:userNotepads}': ['p(95)<800'], // threshold on userNotepads requests only
    'http_req_duration{name:classroomDash}': ['p(95)<800'], // threshold on classroomDash requests only
    'http_req_duration{name:userBadges}': ['p(95)<800'], // threshold on userBadges requests only
    'http_req_duration{name:challengesAll}': ['p(95)<800'], // threshold on challengesAll requests only
    'http_req_duration{name:challengeOne}': ['p(95)<800'], // threshold on challengeOne requests only
    'http_req_duration{name:classroomsAll}': ['p(95)<800'], // threshold classroomsAll requests only
    'http_req_duration{name:classLiveNow}': ['p(95)<800'], // threshold on classLiveNow requests only
    'http_req_duration{name:classSubscribe}': ['p(95)<800'], // threshold on classSubscribe requests only
    'http_req_duration{name:classroomOne}': ['p(95)<800'], // threshold on classroomOne requests only
    'http_req_duration{name:classroomNotepad}': ['p(95)<800'], // threshold on classroomNotepad requests only
    'http_req_duration{name:classroomValAuth}': ['p(95)<800'], // threshold on classroomValAuth requests only
    'http_req_duration{name:userPoints}': ['p(95)<800'], // threshold on userPoints requests only
    'http_req_duration{name:pollsAll}': ['p(95)<800'], // threshold on pollsAll requests only
    'http_req_duration{name:pollsOne}': ['p(95)<800'], // threshold on pollsOne requests only
    'http_req_duration{name:storeAllItems}': ['p(95)<800'], // threshold on storeAllItems requests only
    'http_req_duration{name:storeOneItem}': ['p(95)<800'], // threshold on storeOneItem requests only
    'http_req_duration{name:enums}': ['p(95)<800'], // threshold on enums requests only
    'http_req_duration{name:slider}': ['p(95)<800'], // threshold on slider requests only

    'checks{tag:userProfile}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'checks{tag:userLogin}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:userConnections}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:userClassrooms}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:userClassroomsLink}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:userNotepads}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:classroomDash}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:userBadges}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:challengesAll}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:challengeOne}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:classroomsAll}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:classLiveNow}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:classSubscribe}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:classroomOne}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:classroomNotepad}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:classroomValAuth}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:userPoints}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:pollsAll}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:pollsOne}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:storeAllItems}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:storeOneItem}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:enums}': ['rate>0.95'], // rate of successful checks should be higher than 95%
    'checks{tag:slider}': ['rate>0.95'], // rate of successful checks should be higher than 95%
  },
};

export default function (_) {
  let user = {
    email: lxpData['email'],
    password: lxpData['password'],
    calendarSyncToken: lxpData['calendarSyncToken'],
    id: lxpData['id'],
    challengeId: undefined,
    classroomId: undefined,
    token: undefined,
  };

  const params = {
    headers: {},
  };

  for (let i = 0; i < Object.keys(lxpData.routes).length; i++) {
    let methodUrl = Object.keys(lxpData.routes)[i];
    let reqBody = {};
    let res;
    let fullPath;

    for (let j = 0; j < lxpData.routes[methodUrl].length; j++) {
      let current = lxpData.routes[methodUrl][j];
      const { path, custom, tag, authReq, payload, propertyReturned } = current;

      if (payload) {
        payload.forEach((item) => (reqBody[item] = user[item]));
      }

      if (custom) {
        const prop = path.slice(path.indexOf('$') + 2, path.indexOf('}'));
        fullPath = `${baseUrl}${path.slice(0, path.indexOf('$'))}${user[`${prop}`]}${path.slice(
          path.indexOf('}') + 1
        )}`;
      } else {
        fullPath = `${baseUrl}${path}`;
      }

      switch (methodUrl) {
        case 'login':
        case 'post':
          const postHeaders = authReq && Object.assign(params.headers);
          res =
            payload && payload.length >= 1
              ? http.post(`${fullPath}`, reqBody, {
                  tags: { name: tag },
                  headers: postHeaders,
                })
              : http.post(`${fullPath}`, {
                  tags: { name: tag },
                  headers: postHeaders,
                });
          if (tag.toLowerCase().includes('login')) {
            user.token = res.json()['token'];
            params.headers['Authorization'] = user.token;
          }
          break;
        case 'profile':
        case 'get':
          const getHeaders = authReq && Object.assign(params.headers);
          res =
            payload && payload.length >= 1
              ? http.get(`${fullPath}`, reqBody, {
                  tags: { name: tag },
                  headers: getHeaders,
                })
              : http.get(`${fullPath}`, {
                  tags: { name: tag },
                  headers: getHeaders,
                });
          if (tag === 'challengesAll' && !user.challengeId) {
            user.challengeId = res.json().challenges[0].id;
          } else if (tag === 'classroomDash' && !user.classroomId) {
            user.classroomId = res.json().classrooms[0].id;
          }
          break;
        case 'put':
          const putHeaders = authReq && Object.assign(params.headers);
          res =
            payload && payload.length >= 1
              ? http.put(`${fullPath}`, reqBody, {
                  tags: { name: tag },
                  headers: putHeaders,
                })
              : http.put(`${fullPath}`, {
                  tags: { name: tag },
                  headers: putHeaders,
                });
          break;
        case 'delete':
          const delHeaders = authReq && Object.assign(params.headers);
          res = http.del(`${fullPath}`, null, {
            tags: { name: tag },
            headers: delHeaders,
          });
          break;
        default:
          console.log('No method found');
          break;
      }

      check(
        res,
        {
          [`${methodUrl} - ${path} returns successful status`]: (r) =>
            r.status >= 200 && r.status < 300,
          [`${methodUrl} - ${path} returns valid body`]: (r) =>
            tag === 'classSubscribe' ? true : r.json().hasOwnProperty(propertyReturned),
          [`${methodUrl} - ${path} returns no error codes`]: (r) => r.error_code === 0,
        },
        { tag: tag }
      );

      if (tag === 'classSubscribe') {
        if (res.error_code) {
          console.log('Error with classSubscribe');
        }
      } else if (res.json().hasOwnProperty('error')) {
        console.log(res.body);
      }

      sleep(SLEEP_DURATION);
    }
  }
}

export function handleSummary(data) {
  return {
    './tests/k6/reports/summary.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import { vu } from 'k6/execution';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
const SLEEP_DURATION = 1;
const uniqueData = null;

export const options = {
  teardownTimeout: '2m',
  scenarios: {
    // https://k6.io/docs/test-types/smoke-testing/
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '40s',
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

    'http_req_duration{name:userLogin}': ['p(95)<800'], // threshold on userLogin requests only
    'checks{tag:userLogin}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userProfile}': ['p(95)<800'], // threshold on userProfile requests only
    'checks{tag:userProfile}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userConnections}': ['p(95)<800'], // threshold on userConnections requests only
    'checks{tag:userConnections}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userBadges}': ['p(95)<800'], // threshold on userBadges requests only
    'checks{tag:userBadges}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userClassrooms}': ['p(95)<800'], // threshold on userClassrooms requests only
    'checks{tag:userClassrooms}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userClassroomsLink}': ['p(95)<800'], // threshold on userClassroomsLink requests only
    'checks{tag:userClassroomsLink}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userNotepads}': ['p(95)<800'], // threshold on userNotepads requests only
    'checks{tag:userNotepads}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:challengesAll}': ['p(95)<800'], // threshold on challengesAll requests only
    'checks{tag:challengesAll}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:challengeOne}': ['p(95)<800'], // threshold on challengeOne requests only
    'checks{tag:challengeOne}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:classroomsAll}': ['p(95)<800'], // threshold on classroomsAll requests only
    'checks{tag:classroomsAll}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:classroomDash}': ['p(95)<800'], // threshold on classroomDash requests only
    'checks{tag:classroomDash}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:classLiveNow}': ['p(95)<800'], // threshold on classLiveNow requests only
    'checks{tag:classLiveNow}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:classSubscribe}': ['p(95)<800'], // threshold on classSubscribe requests only
    'checks{tag:classSubscribe}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:classroomOne}': ['p(95)<800'], // threshold on classroomOne requests only
    'checks{tag:classroomOne}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:classroomNotepad}': ['p(95)<800'], // threshold on classroomNotepad requests only
    'checks{tag:classroomNotepad}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userPoints}': ['p(95)<800'], // threshold on userPoints requests only
    'checks{tag:userPoints}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:pollsAll}': ['p(95)<800'], // threshold on pollsAll requests only
    'checks{tag:pollsAll}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:pollOne}': ['p(95)<800'], // threshold on pollOne requests only
    'checks{tag:pollOne}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:storeAllItems}': ['p(95)<800'], // threshold on storeAllItems requests only
    'checks{tag:storeAllItems}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:storeOneItem}': ['p(95)<800'], // threshold on storeOneItem requests only
    'checks{tag:storeOneItem}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:enums}': ['p(95)<800'], // threshold on enums requests only
    'checks{tag:enums}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:slider}': ['p(95)<800'], // threshold on slider requests only
    'checks{tag:slider}': ['rate>0.99'], // rate of successful checks should be higher than 99%
    'http_req_duration{name:userLogout}': ['p(95)<800'], // threshold on userLogout requests only
    'checks{tag:userLogout}': ['rate>0.99'], // rate of successful checks should be higher than 99%_CHECKS,
  },
};

export default function () {
  const vuObj = {
    email: 'rose.landroche@24g.com',
    password: 'insecure123!@#',
    firstName: 'Rose',
    lastName: 'Landroche',
    id: '1287b0b6-af73-43cf-806c-6119c4a6bf7b',
    calendarSyncToken: '83e1ecfe-c358-4e18-a55f-67bb13cb9397',
    challengeId: '',
    classroomId: '',
    pollId: '',
    itemId: '',
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

  payload = ['email', 'password'];
  if (true) {
    parsePayload(false);
  }
  payload = [];
  tagName = 'userLoginRes';
  const userLoginRes =
    reqBody && Object.keys(reqBody).length >= 1
      ? http.post('https://api-dev-2772-1.demo.lxp.live/users/auth', reqBody, {
          tags: { name: 'userLogin' },
          headers: false ? params.headers : null,
        })
      : http.post('https://api-dev-2772-1.demo.lxp.live/users/auth', null, {
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

  tagName = 'userProfileRes';
  const userProfileRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/users/${vuObj['id']}/profile`,
    {
      tags: { name: 'userProfile' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, userProfileRes);

  check(
    userProfileRes,
    {
      ['get - /users/${id}/profile returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /users/${id}/profile returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('user')
          : JSON.stringify(r.body).includes('null'),
      ['get - /users/${id}/profile returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userProfile' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'userConnectionsRes';
  const userConnectionsRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/users/${vuObj['id']}/connections`,
    {
      tags: { name: 'userConnections' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, userConnectionsRes);

  check(
    userConnectionsRes,
    {
      ['get - /users/${id}/connections returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /users/${id}/connections returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('userConnections')
          : JSON.stringify(r.body).includes('null'),
      ['get - /users/${id}/connections returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userConnections' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'userBadgesRes';
  const userBadgesRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/users/${vuObj['id']}/badges`,
    {
      tags: { name: 'userBadges' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, userBadgesRes);

  check(
    userBadgesRes,
    {
      ['get - /users/${id}/badges returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /users/${id}/badges returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('userBadges')
          : JSON.stringify(r.body).includes('null'),
      ['get - /users/${id}/badges returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userBadges' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'userClassroomsRes';
  const userClassroomsRes = http.get(`https://api-dev-2772-1.demo.lxp.live/users/classrooms`, {
    tags: { name: 'userClassrooms' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, userClassroomsRes);

  check(
    userClassroomsRes,
    {
      ['get - /users/classrooms returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /users/classrooms returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('classrooms')
          : JSON.stringify(r.body).includes('null'),
      ['get - /users/classrooms returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userClassrooms' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'userClassroomsLinkRes';
  const userClassroomsLinkRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/users/classrooms/link`,
    {
      tags: { name: 'userClassroomsLink' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, userClassroomsLinkRes);

  check(
    userClassroomsLinkRes,
    {
      ['get - /users/classrooms/link returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /users/classrooms/link returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('icsLink')
          : JSON.stringify(r.body).includes('null'),
      ['get - /users/classrooms/link returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userClassroomsLink' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'userNotepadsRes';
  const userNotepadsRes = http.get(`https://api-dev-2772-1.demo.lxp.live/users/notepads`, {
    tags: { name: 'userNotepads' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, userNotepadsRes);

  check(
    userNotepadsRes,
    {
      ['get - /users/notepads returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /users/notepads returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('notepads')
          : JSON.stringify(r.body).includes('null'),
      ['get - /users/notepads returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userNotepads' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'challengesAllRes';
  const challengesAllRes = http.get(`https://api-dev-2772-1.demo.lxp.live/challenges/dashboard`, {
    tags: { name: 'challengesAll' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, challengesAllRes);

  check(
    challengesAllRes,
    {
      ['get - /challenges/dashboard returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /challenges/dashboard returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('challenges')
          : JSON.stringify(r.body).includes('null'),
      ['get - /challenges/dashboard returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'challengesAll' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'challengeOneRes';
  const challengeOneRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/challenges/${vuObj['challengeId']}`,
    {
      tags: { name: 'challengeOne' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, challengeOneRes);

  check(
    challengeOneRes,
    {
      ['get - /challenges/${challengeId} returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /challenges/${challengeId} returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('id')
          : JSON.stringify(r.body).includes('null'),
      ['get - /challenges/${challengeId} returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'challengeOne' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'classroomsAllRes';
  const classroomsAllRes = http.get(`https://api-dev-2772-1.demo.lxp.live/classrooms`, {
    tags: { name: 'classroomsAll' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, classroomsAllRes);

  check(
    classroomsAllRes,
    {
      ['get - /classrooms returns successful status']: (r) => r.status === 200 || r.status === 204,
      ['get - /classrooms returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('classrooms')
          : JSON.stringify(r.body).includes('null'),
      ['get - /classrooms returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'classroomsAll' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'classroomDashRes';
  const classroomDashRes = http.get(`https://api-dev-2772-1.demo.lxp.live/classrooms/dashboard`, {
    tags: { name: 'classroomDash' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, classroomDashRes);

  check(
    classroomDashRes,
    {
      ['get - /classrooms/dashboard returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /classrooms/dashboard returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('classrooms')
          : JSON.stringify(r.body).includes('null'),
      ['get - /classrooms/dashboard returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'classroomDash' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'classLiveNowRes';
  const classLiveNowRes = http.get(`https://api-dev-2772-1.demo.lxp.live/classrooms/live-now`, {
    tags: { name: 'classLiveNow' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, classLiveNowRes);

  check(
    classLiveNowRes,
    {
      ['get - /classrooms/live-now returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /classrooms/live-now returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('live')
          : JSON.stringify(r.body).includes('null'),
      ['get - /classrooms/live-now returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'classLiveNow' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'classSubscribeRes';
  const classSubscribeRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/classrooms/subscribe?token=${vuObj['calendarSyncToken']}`,
    {
      tags: { name: 'classSubscribe' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, classSubscribeRes);

  check(
    classSubscribeRes,
    {
      ['get - /classrooms/subscribe?token=${calendarSyncToken} returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /classrooms/subscribe?token=${calendarSyncToken} returns valid body']: (r) =>
        r.status !== 204 && false
          ? r.json().hasOwnProperty('null')
          : JSON.stringify(r.body).includes('BEGIN:VCALENDAR'),
      ['get - /classrooms/subscribe?token=${calendarSyncToken} returns no error codes']: (r) =>
        r.error_code === 0,
    },
    { tag: 'classSubscribe' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'classroomOneRes';
  const classroomOneRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/classrooms/${vuObj['classroomId']}`,
    {
      tags: { name: 'classroomOne' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, classroomOneRes);

  check(
    classroomOneRes,
    {
      ['get - /classrooms/${classroomId} returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /classrooms/${classroomId} returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('classroom')
          : JSON.stringify(r.body).includes('null'),
      ['get - /classrooms/${classroomId} returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'classroomOne' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'classroomNotepadRes';
  const classroomNotepadRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/classrooms/${vuObj['classroomId']}/notepad`,
    {
      tags: { name: 'classroomNotepad' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, classroomNotepadRes);

  check(
    classroomNotepadRes,
    {
      ['get - /classrooms/${classroomId}/notepad returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /classrooms/${classroomId}/notepad returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('notepad')
          : JSON.stringify(r.body).includes('null'),
      ['get - /classrooms/${classroomId}/notepad returns no error codes']: (r) =>
        r.error_code === 0,
    },
    { tag: 'classroomNotepad' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'userPointsRes';
  const userPointsRes = http.get(`https://api-dev-2772-1.demo.lxp.live/points/${vuObj['id']}`, {
    tags: { name: 'userPoints' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, userPointsRes);

  check(
    userPointsRes,
    {
      ['get - /points/${id} returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /points/${id} returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('rewardPoints')
          : JSON.stringify(r.body).includes('null'),
      ['get - /points/${id} returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userPoints' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'pollsAllRes';
  const pollsAllRes = http.get(`https://api-dev-2772-1.demo.lxp.live/polls`, {
    tags: { name: 'pollsAll' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, pollsAllRes);

  check(
    pollsAllRes,
    {
      ['get - /polls returns successful status']: (r) => r.status === 200 || r.status === 204,
      ['get - /polls returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('polls')
          : JSON.stringify(r.body).includes('null'),
      ['get - /polls returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'pollsAll' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'pollOneRes';
  const pollOneRes = http.get(`https://api-dev-2772-1.demo.lxp.live/polls/${vuObj['pollId']}`, {
    tags: { name: 'pollOne' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, pollOneRes);

  check(
    pollOneRes,
    {
      ['get - /polls/${pollId} returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /polls/${pollId} returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('poll')
          : JSON.stringify(r.body).includes('null'),
      ['get - /polls/${pollId} returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'pollOne' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'storeAllItemsRes';
  const storeAllItemsRes = http.get(`https://api-dev-2772-1.demo.lxp.live/store`, {
    tags: { name: 'storeAllItems' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, storeAllItemsRes);

  check(
    storeAllItemsRes,
    {
      ['get - /store returns successful status']: (r) => r.status === 200 || r.status === 204,
      ['get - /store returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('items')
          : JSON.stringify(r.body).includes('null'),
      ['get - /store returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'storeAllItems' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'storeOneItemRes';
  const storeOneItemRes = http.get(
    `https://api-dev-2772-1.demo.lxp.live/store/${vuObj['itemId']}`,
    {
      tags: { name: 'storeOneItem' },
      headers: true ? params.headers : null,
    }
  );

  saveIds(tagName, storeOneItemRes);

  check(
    storeOneItemRes,
    {
      ['get - /store/${itemId} returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['get - /store/${itemId} returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('item')
          : JSON.stringify(r.body).includes('null'),
      ['get - /store/${itemId} returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'storeOneItem' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'enumsRes';
  const enumsRes = http.get(`https://api-dev-2772-1.demo.lxp.live/enums`, {
    tags: { name: 'enums' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, enumsRes);

  check(
    enumsRes,
    {
      ['get - /enums returns successful status']: (r) => r.status === 200 || r.status === 204,
      ['get - /enums returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('assetTypes')
          : JSON.stringify(r.body).includes('null'),
      ['get - /enums returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'enums' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  tagName = 'sliderRes';
  const sliderRes = http.get(`https://api-dev-2772-1.demo.lxp.live/slider`, {
    tags: { name: 'slider' },
    headers: true ? params.headers : null,
  });

  saveIds(tagName, sliderRes);

  check(
    sliderRes,
    {
      ['get - /slider returns successful status']: (r) => r.status === 200 || r.status === 204,
      ['get - /slider returns valid body']: (r) =>
        r.status !== 204 && true
          ? r.json().hasOwnProperty('slider')
          : JSON.stringify(r.body).includes('null'),
      ['get - /slider returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'slider' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  payload = null;
  if (null) {
    parsePayload(false);
  }
  payload = [];
  tagName = 'userLogoutRes';
  const userLogoutRes =
    reqBody && Object.keys(reqBody).length >= 1
      ? http.post('https://api-dev-2772-1.demo.lxp.live/users/logout', reqBody, {
          tags: { name: 'userLogout' },
          headers: true ? params.headers : null,
        })
      : http.post('https://api-dev-2772-1.demo.lxp.live/users/logout', null, {
          tags: { name: 'userLogout' },
          headers: true ? params.headers : null,
        });

  check(
    userLogoutRes,
    {
      ['post - /users/logout returns successful status']: (r) =>
        r.status === 200 || r.status === 204,
      ['post - /users/logout returns valid body']: (r) =>
        r.status === 204 ? true : r.json().hasOwnProperty(''),
      ['post - /users/logout returns no error codes']: (r) => r.error_code === 0,
    },
    { tag: 'userLogout' }
  );
  reqBody = {};
  sleep(SLEEP_DURATION);

  vuObj['token'] = null;
}

export function handleSummary(data) {
  return {
    'packages/k6-generator/src/reports/02_lxpDemo_summary.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

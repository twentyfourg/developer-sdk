// 1. init code
import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const baseUrl = 'https://api-dev-2772-1.demo.lxp.live';

export const options = {
  teardownTimeout: '2m',
  scenarios: {
    // https://k6.io/docs/test-types/smoke-testing/
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '10s',
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

const SLEEP_DURATION = 1;

// COVERS LOG IN AND ALL GET REQUESTS SHOWN ON SWAGGER
export default function (_) {
  let user = {
    email: 'rose.landroche@24g.com',
    password: 'insecure123!@#',
    id: '1287b0b6-af73-43cf-806c-6119c4a6bf7b',
    calendarSyncToken: '83e1ecfe-c358-4e18-a55f-67bb13cb9397',
  };

  const params = {
    headers: {
      Authorization: '',
    },
  };

  group('users routes', (_) => {
    // login
    let payload = {
      email: user.email,
      password: user.password,
    };

    const loginRes = http.post(`${baseUrl}/users/auth`, payload, {
      tags: { name: 'userLogin' },
    });
    user.token = loginRes.json()['token'];

    params.headers['Authorization'] = user.token;

    check(
      loginRes,
      {
        'userLogin returns status 200': (r) => r.status === 200,
        'userLogin returns token': (r) => r.json().hasOwnProperty('token'),
        'userLogin returns no errors': (r) => r.error_code === 0,
      },
      { tag: 'userLogin' }
    );

    sleep(SLEEP_DURATION);

    //   // get my profile
    //   const profileRes = http.get(`${baseUrl}/users/${user.id}/profile`, {
    //     tags: { name: 'userProfile' },
    //     headers: params.headers,
    //   });

    //   check(
    //     profileRes,
    //     {
    //       '/users/${userId}/profile returns status 200': (r) => r.status === 200,
    //       '/users/${userId}/profile returns correct first name on account': (r) =>
    //         r.json().user.firstName === 'Rose',
    //       '/users/${userId}/profile returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'userProfile' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get my connections
    //   const connectionsRes = http.get(`${baseUrl}/users/${user.id}/connections`, {
    //     tags: { name: 'userConnections' },
    //     headers: params.headers,
    //   });

    //   check(
    //     connectionsRes,
    //     {
    //       '/users/${userId}/connections returns status 200': (r) => r.status === 200,
    //       '/users/${userId}/connections returns userConnections': (r) =>
    //         r.json().hasOwnProperty('userConnections'),
    //       '/users/${userId}/connections returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'userConnections' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get my badges
    //   const badgesRes = http.get(`${baseUrl}/users/${user.id}/badges`, {
    //     tags: { name: 'userBadges' },
    //     headers: params.headers,
    //   });

    //   check(
    //     badgesRes,
    //     {
    //       '/users/${userId}/badges returns status 200': (r) => r.status === 200,
    //       '/users/${userId}/badges returns userBadges': (r) => r.json().hasOwnProperty('userBadges'),
    //       '/users/${userId}/badges returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'userBadges' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get my classrooms
    //   const userClassroomsRes = http.get(`${baseUrl}/users/classrooms`, {
    //     tags: { name: 'userClassrooms' },
    //     headers: params.headers,
    //   });

    //   check(
    //     userClassroomsRes,
    //     {
    //       '/users/classrooms returns status 200': (r) => r.status === 200,
    //       '/users/classrooms returns classrooms': (r) => r.json().hasOwnProperty('classrooms'),
    //       '/users/classrooms returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'userClassrooms' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get my classroom links
    //   const userClassroomsLinkRes = http.get(`${baseUrl}/users/classrooms/link`, {
    //     tags: { name: 'userClassroomsLink' },
    //     headers: params.headers,
    //   });

    //   check(
    //     userClassroomsLinkRes,
    //     {
    //       '/users/classrooms/link returns status 200': (r) => r.status === 200,
    //       '/users/classrooms/link returns subscribe and ics links': (r) =>
    //         r.json().hasOwnProperty('subscribeLink') && r.json().hasOwnProperty('icsLink'),
    //       '/users/classrooms/link returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'userClassroomsLink' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get my notepads
    //   const userNotepadsRes = http.get(`${baseUrl}/users/notepads`, {
    //     tags: { name: 'userNotepads' },
    //     headers: params.headers,
    //   });

    //   check(
    //     userNotepadsRes,
    //     {
    //       '/users/notepads returns status 200': (r) => r.status === 200,
    //       '/users/notepads returns body containing notepads array': (r) =>
    //         r.json().hasOwnProperty('notepads'),
    //       '/users/notepads returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'userNotepads' }
    //   );

    //   sleep(SLEEP_DURATION);
    // });

    // group('challenge routes', () => {
    //   // get challenge dashboard
    //   const allChallengesRes = http.get(`${baseUrl}/challenges/dashboard`, {
    //     tags: { name: 'challengesAll' },
    //     headers: params.headers,
    //   });

    //   user.challengeId = allChallengesRes.json().challenges[0].id;

    //   check(
    //     allChallengesRes,
    //     {
    //       '/challenges/dashboard returns status 200': (r) => r.status === 200,
    //       '/challenges/dashboard returns challenges': (r) => r.json().hasOwnProperty('challenges'),
    //       '/challenges/dashboard returns no error': (r) => r.error_code === 0,
    //     },
    //     { tag: 'challengesAll' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get one challenge
    //   const challengeRes = http.get(`${baseUrl}/challenges/${user.challengeId}`, {
    //     tags: { name: 'challengeOne' },
    //     headers: params.headers,
    //   });

    //   check(
    //     challengeRes,
    //     {
    //       '/challenges/${challengeId} returns status 200': (r) => r.status === 200,
    //       '/challenges/${challengeId} returns challenge with matching id': (r) =>
    //         r.json().id === user.challengeId,
    //       '/challenges/${challengeId} returns no error': (r) => r.error_code === 0,
    //     },
    //     { tag: 'challengeOne' }
    //   );

    //   sleep(SLEEP_DURATION);
    // });

    // group('classroom routes', () => {
    //   // get all classrooms
    //   const classroomsRes = http.get(`${baseUrl}/classrooms`, {
    //     tags: { name: 'classroomsAll' },
    //     headers: params.headers,
    //   });

    //   check(
    //     classroomsRes,
    //     {
    //       '/classrooms returns status 200': (r) => r.status === 200,
    //       '/classrooms returns different types of classrooms': (r) =>
    //         r.json().classrooms.hasOwnProperty('liveClassrooms') &&
    //         r.json().classrooms.hasOwnProperty('upcomingClassrooms'),
    //       '/classrooms returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'classroomsAll' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get classroom dashboard
    //   const classroomDashRes = http.get(`${baseUrl}/classrooms/dashboard`, {
    //     tags: { name: 'classroomDash' },
    //     headers: params.headers,
    //   });

    //   user.classroomId = classroomDashRes.json().classrooms[0].id;

    //   check(
    //     classroomDashRes,
    //     {
    //       '/classrooms/dashboard returns status 200': (r) => r.status === 200,
    //       '/classrooms/dashboard returns classrooms': (r) => r.json().hasOwnProperty('classrooms'),
    //       '/classrooms/dashboard returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'classroomDash' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get live classrooms
    //   const classLiveNowRes = http.get(`${baseUrl}/classrooms/live-now`, {
    //     tags: { name: 'classLiveNow' },
    //     headers: params.headers,
    //   });

    //   check(
    //     classLiveNowRes,
    //     {
    //       '/classrooms/live-now returns status 200': (r) => r.status === 200,
    //       '/classrooms/live-now returns valid response': (r) => r.json().live === true,
    //       '/classrooms/live-now returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'classLiveNow' }
    //   );

    //   sleep(SLEEP_DURATION);

    // subscribe classrooms
    const classSubscribeRes = http.get(
      `${baseUrl}/classrooms/subscribe?token=${user.calendarSyncToken}`,
      {
        tags: { name: 'classSubscribe' },
        headers: params.headers,
      }
    );

    // console.log(JSON.stringify(classSubscribeRes.body));
    // console.log(JSON.stringify(classSubscribeRes.body.length));

    check(
      classSubscribeRes,
      {
        '/classrooms/subscribe returns status 200': (r) => r.status === 200,
        '/classrooms/subscribe returns valid body': (r) =>
          JSON.stringify(r.body).includes('BEGIN:VCALENDAR'),
        '/classrooms/subscribe returns no errors': (r) => r.error_code === 0,
      },
      { tag: 'classSubscribe' }
    );

    sleep(SLEEP_DURATION);

    //   // get one classroom
    //   const classroomRes = http.get(`${baseUrl}/classrooms/${user.classroomId}`, {
    //     tags: { name: 'classroomOne' },
    //     headers: params.headers,
    //   });

    //   check(
    //     classroomRes,
    //     {
    //       '/classrooms/${classroomId} returns status 200': (r) => r.status === 200,
    //       '/classrooms/${classroomId} returns classroom with matching id': (r) =>
    //         r.json().classroom.id === user.classroomId,
    //       '/classrooms/${classroomId} returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'classroomOne' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get classroom notepad
    //   const classroomNotepadRes = http.get(`${baseUrl}/classrooms/${user.classroomId}/notepad`, {
    //     tags: { name: 'classroomNotepad' },
    //     headers: params.headers,
    //   });

    //   check(
    //     classroomNotepadRes,
    //     {
    //       '/classrooms/${classroomId}/notepad returns status 200': (r) => r.status === 200,
    //       '/classrooms/${classroomId}/notepad returns object with notepad key': (r) =>
    //         r.json().hasOwnProperty('notepad'),
    //       '/classrooms/${classroomId}/notepad returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'classroomNotepad' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // validate auth for classroom access
    //   // I AM NOT REGISTERED AND AM NOT ABLE TO REGISTER - AN UNREGISTERED ERROR IS CORRECT AS OF MARCH 21
    //   // const classroomValAuthRes = http.get(
    //   //   `${baseUrl}/classrooms/${user.classroomId}/validate-auth`,
    //   //   {
    //   //     tags: { name: 'classroomValAuth' },
    //   //     headers: params.headers,
    //   //   }
    //   // );

    //   // check(
    //   //   classroomValAuthRes,
    //   //   {
    //   //     '/classrooms/${classroomId}/validate-auth - unregistered user - returns ERROR status 403': (
    //   //       r
    //   //     ) => r.status === 403,
    //   //     '/classrooms/${classroomId}/validate-auth - unregistered user - returns ERROR object': (
    //   //       r
    //   //     ) => r.json().hasOwnProperty('error'),
    //   //     '/classrooms/${classroomId}/validate-auth - unregistered user - returns an ERROR': (r) =>
    //   //       r.error_code !== 0,
    //   //   },
    //   //   { tag: 'classroomValAuth' }
    //   // );

    //   // sleep(SLEEP_DURATION);
    // });

    // group('points routes', () => {
    //   // get my points
    //   const userPointsRes = http.get(`${baseUrl}/points/${user.id}`, {
    //     tags: { name: 'userPoints' },
    //     headers: params.headers,
    //   });

    //   check(
    //     userPointsRes,
    //     {
    //       '/points/${userId} returns status 200': (r) => r.status === 200,
    //       '/points/${userId} returns rewardPoints': (r) => r.json().hasOwnProperty('rewardPoints'),
    //       '/points/${userId} returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'userPoints' }
    //   );

    //   sleep(SLEEP_DURATION);
    // });

    // group('polls routes', () => {
    //   // get polls
    //   const pollsRes = http.get(`${baseUrl}/polls`, {
    //     tags: { name: 'pollsAll' },
    //     headers: params.headers,
    //   });

    //   user.poll = pollsRes.json().polls[0].id;

    //   check(
    //     pollsRes,
    //     {
    //       '/polls returns status 200': (r) => r.status === 200,
    //       '/polls returns polls array': (r) => r.json().hasOwnProperty('polls'),
    //       '/polls returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'pollsAll' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get one poll
    //   const singlePollRes = http.get(`${baseUrl}/polls/${user.poll}`, {
    //     tags: { name: 'pollsOne' },
    //     headers: params.headers,
    //   });

    //   check(
    //     singlePollRes,
    //     {
    //       '/polls/${pollId} returns status 200': (r) => r.status === 200,
    //       '/polls/${pollId} returns poll with id matching id requested': (r) =>
    //         r.json().poll.id === user.poll,
    //       '/polls/${pollId} returns no error': (r) => r.error_code === 0,
    //     },
    //     { tag: 'pollsOne' }
    //   );

    //   sleep(SLEEP_DURATION);
    // });

    // group('store routes', () => {
    //   // get store
    //   const storeRes = http.get(`${baseUrl}/store`, {
    //     tags: { name: 'storeAllItems' },
    //     headers: params.headers,
    //   });

    //   user.storeItem = storeRes.json().items[0].id;

    //   check(
    //     storeRes,
    //     {
    //       '/store returns status 200': (r) => r.status === 200,
    //       '/store returns items': (r) => r.json().hasOwnProperty('items'),
    //       '/store returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'storeAllItems' }
    //   );

    //   sleep(SLEEP_DURATION);

    //   // get item from store
    //   const storeItemRes = http.get(`${baseUrl}/store/${user.storeItem}`, {
    //     tags: { name: 'storeOneItem' },
    //     headers: params.headers,
    //   });

    //   check(
    //     storeItemRes,
    //     {
    //       '/store/${itemID} returns status 200': (r) => r.status === 200,
    //       '/store/${itemID} returns item details': (r) => r.json().hasOwnProperty('item'),
    //       '/store/${itemID} returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'storeOneItem' }
    //   );

    //   sleep(SLEEP_DURATION);
    // });

    // // group('training-assets routes', () => {
    // // get training-asset ** APPEARS TO BE ISSUE WITH ID PROVIDED IN SWAGGER
    // // const trainingAssetRes = http.get(
    // //   `${baseUrl}/training-assets/befa52ec-97ab-4f2b-a765-fa096b1fb32e`,
    // //   {
    // //     tags: { name: 'trainingAssetOne' },
    // //     headers: params.headers,
    // //   }
    // // );

    // // console.log(trainingAssetRes.body);

    // // check(
    // //   trainingAssetRes,
    // //   {
    // //     '/training-assets/${asset-id} returns status 200': (r) => r.status === 200,
    // // '/training-assets/${asset-id} returns items': (r) => r.json().hasOwnProperty('items'),
    // // '/training-assets/${asset-id} returns no error': (r) => r.error_code === 0,
    // //     },
    // //     { tag: 'trainingAssetOne' }
    // //   );

    // //   sleep(SLEEP_DURATION);
    // // });

    // group('misc routes', () => {
    //   // enums
    //   const enumsRes = http.get(`${baseUrl}/enums`, {
    //     tags: { name: 'enums' },
    //     headers: params.headers,
    //   });

    //   check(
    //     enumsRes,
    //     {
    //       '/enums returns status 200': (r) => r.status === 200,
    //       '/enums returns assetTypes': (r) => r.json().hasOwnProperty('assetTypes'),
    //       '/enums returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'enums' }
    //   );
    //   sleep(SLEEP_DURATION);

    //   // slider
    //   const sliderRes = http.get(`${baseUrl}/slider`, {
    //     tags: { name: 'slider' },
    //     headers: params.headers,
    //   });

    //   check(
    //     sliderRes,
    //     {
    //       '/slider returns status 200': (r) => r.status === 200,
    //       '/slider returns slider array': (r) => r.json().hasOwnProperty('slider'),
    //       '/slider returns no errors': (r) => r.error_code === 0,
    //     },
    //     { tag: 'slider' }
    //   );
    //   sleep(SLEEP_DURATION);

    //   // presigned-redirect ** COULDN'T FIND THIS IN REPO SO SKIPPING FOR NOW
    //   // const presignedRedRes = http.get(`${baseUrl}/presigned-redirect`, {
    //   //   tags: { name: 'presignedRedirect' },
    //   //   headers: params.headers,
    //   // });
    //   // console.log(presignedRedRes.body);
    //   // check(
    //   //   presignedRedRes,
    //   //   {
    //   //     '/presigned-redirect returns status 200': (r) => r.status === 200,
    //   // '/presigned-redirect returns rewardPoints': (r) => r.json().hasOwnProperty('presigned-redirect'),
    //   // '/presigned-redirect returns no error': (r) => r.error_code === 0,
    //   //   },
    //   //   { tag: 'presignedRedirect' }
    //   // );
    //   // sleep(SLEEP_DURATION);
  });
}

export function handleSummary(data) {
  return {
    './tests/k6/reports/summary.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

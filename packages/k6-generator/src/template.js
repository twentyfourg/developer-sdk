import http from 'k6/http';
import { sleep, check } from 'k6';
import { scenario } from 'k6/execution';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
const SLEEP_DURATION = DYNAMIC_SLEEP_TIME;
const uniqueData = DYNAMIC_IMPORTS_VARS;
const uniqueObj = DYNAMIC_UNIQUE_OBJ;

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
    DYNAMIC_THRESHOLDS_CHECKS,
  },
};

export default function () {
  DYNAMIC_VU_OBJ;

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
      reqBody = uniqueData[uniqueObj][scenario.iterationInTest];
      Object.keys(reqBody).forEach((key) => {
        vuObj[key] = reqBody[key];
      });
    }
  };

  DYNAMIC_ROUTE_RES;
}

export function handleSummary(data) {
  return {
    DYNAMIC_SUMMARY_PATH: htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

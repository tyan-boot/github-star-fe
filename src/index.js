import { h, app } from "hyperapp";
import Chart from "chart.js";
import Axios from "axios";

import "./app.less";

const state = {
  state: null,
  data: {}
};

const actions = {
  updateState: value => ({ state: value }),
  updateData: value => ({ data: value })
};

async function fetchNewState(state, actions) {
  try {
    let resp = await Axios.post("/api/state");

    actions.updateState(resp.data.state);

    localStorage.setItem("state_time", new Date().getTime());

    return resp.data.state;
  } catch (err) {
    alert("发生了错误...");
  }
}

async function onLoad(actions) {
  let localState = localStorage.getItem("state");
  let updateTime = parseInt(localStorage.getItem("state_time"));

  if (localState === null || updateTime === null) {
    let newState = await fetchNewState();

    // redirect;
    window.location.href = `https://github.com/login/oauth/authorize?client_id=a0ba7c72bdbada6503b0&state=${newState}`;
    return;
  }

  try {
    let resp = await Axios.post("/api/stars", {
      state: localState
    });

    actions.updateData(resp.data);
  } catch (err) {
    console.error(err);

    alert("发生了错误");
  }
}

function showStar(ele, state) {
  let ctx = ele.getContext("2d");

  let chart = new Chart(ctx, {
    type: "horizontalBar",
    data: state.data,
    options: {
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}

const view = (state, actions) => (
  <div oncreate={() => onLoad(actions)}>
    <canvas oncreate={ele => showStar(ele, state)} id="chart" />
  </div>
);

app(state, actions, view, document.body);

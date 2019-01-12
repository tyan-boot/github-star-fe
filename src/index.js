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

async function fetchNewState(actions) {
  try {
    let resp = await Axios.post("/api/state");

    actions.updateState(resp.data.state);
    localStorage.setItem("state", resp.data.state);
    return resp.data.state;
  } catch (err) {
    console.error(err);
    alert("发生了错误...");
  }
}

async function onLoad(state, actions) {
  let localState = localStorage.getItem("state");

  try {
    let resp = await Axios.post("/api/stars", {
      state: localState
    });

    let data = resp.data;

    if (data.status === 4) {
      let newState = await fetchNewState(actions);

      window.location.href = `https://github.com/login/oauth/authorize?client_id=a0ba7c72bdbada6503b0&state=${newState}`;
      return;
    }

    let chartData = {
      labels: Object.keys(data),
      datasets: [
        {
          label: "repo",
          data: Object.values(data)
        }
      ]
    };

    let ele = document.querySelector("#chart");
    showStar(ele, chartData);
    actions.updateData(chartData);
  } catch (err) {
    console.error(err);

    alert("发生了错误");
  }
}

function showStar(ele, data) {
  let ctx = ele.getContext("2d");

  let chart = new Chart(ctx, {
    type: "horizontalBar",
    data: data,
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
  <div oncreate={() => onLoad(state, actions)}>
    <canvas oncreate={ele => showStar(ele, state)} id="chart" />
  </div>
);

app(state, actions, view, document.body);

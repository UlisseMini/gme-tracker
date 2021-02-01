import {html, svg, render} from 'lit-html';
import {until} from 'lit-html/directives/until.js';

/*
const prettyJSON = (data) =>
  html`<pre>${JSON.stringify(data, null, 2)}</pre>`
*/

const bar = ({data, label}, i) => {
  const width = 20;
  const margin = 1;
  const x = (width + margin) * i;

  // TODO: Move translate/scale transform into css, or compute in JS
  return svg`
    <g class="bar">
      <rect width=${width} height=${data} x=${x} data-label=${label} transform="translate(0,200) scale(1,-1)"/>
      <text x=${x} y=100>${label}</text>
    </g>
  `
}

const chart = (data) => {
  const width = 600;
  const height = 200;

  console.log('charting', data)
  const bars = data.map(bar)

  let res = html`
  <svg version="1.1" baseProfile="full" width=${width} height=${height} xmlns="http://www.w3.org/2000/svg">
    <g class="chart">
      ${bars}
    </g>
    </svg>
  `
  console.log(res);
  return res;
}

const shortData = ({data, symbol}) => {
  console.log('got data for', symbol)

  // sort by most recent
  data = data.sort((a, b) => Date.parse(a.date) > Date.parse(b.date))
  data = data.map(x => {
    return {
      data: Math.round(x.shortInterest / 1e6),
      label: x.date,
    }
  })

  return html`
    <hr/>
    <h3>Short interest</h3>
    ${chart(data)}
  `
}

const app = (data) => html`
  <h1>$GME charts and data</h1>
  ${until(data.short.then(shortData), html`<p>Loading short interest...</p>`)}
`

const data = {
  short: fetch('/shorty.json').then(r => r.json()),
}
window.data = data;

// TODO: Do I really need DOMContentLoaded?
document.addEventListener('DOMContentLoaded', () => {
  render(app(data), document.body)
})

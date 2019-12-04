<template>
  <div>
    <svg
      id="play"
      viewBox="0 0 163 163"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <g fill="none">
        <g transform="translate(2.000000, 2.000000)" stroke-width="4">
          <path
            d="M10,80 C10,118.107648 40.8923523,149 79,149 L79,149 C117.107648,149 148,118.107648 148,80 C148,41.8923523 117.107648,11 79,11"
            id="lineOne"
            stroke="#A5CB43"
          />
          <path
            d="M105.9,74.4158594 L67.2,44.2158594 C63.5,41.3158594 58,43.9158594 58,48.7158594 L58,109.015859 C58,113.715859 63.4,116.415859 67.2,113.515859 L105.9,83.3158594 C108.8,81.1158594 108.8,76.6158594 105.9,74.4158594 L105.9,74.4158594 Z"
            id="triangle"
            stroke="#A3CD3A"
          />
          <path
            d="M159,79.5 C159,35.5933624 123.406638,0 79.5,0 C35.5933624,0 0,35.5933624 0,79.5 C0,123.406638 35.5933624,159 79.5,159 L79.5,159"
            id="lineTwo"
            stroke="#A5CB43"
          />
        </g>
      </g>
    </svg>
  </div>
</template>

<style >
svg#play {
  width: 100px;
  margin: 120px auto;
  display: block;
  cursor: pointer;
  transform-origin: 50% 50%;
}

svg#play #triangle {
  fill: rgba(22, 22, 22, 0);
  transition: 500ms;
  transform-origin: 50% 50%;
}
svg#play:hover #triangle {
  fill: #a3cd3a;
  transform-origin: 50% 50%;
}

svg #lineOne,
svg #lineTwo {
  transform-origin: 50% 50%;
  transition: 1s;
}

svg:hover #lineOne {
  transform: rotate(260deg);
  -webkit-transform: rotate(260deg);
  -moz-transform: rotate(260deg);
  -o-transform: rotate(260deg);
  transform-origin: 50% 50%;
}

svg:hover #lineTwo {
  transform: rotate(-450deg);
  transform-origin: 50% 50%;
}
</style>
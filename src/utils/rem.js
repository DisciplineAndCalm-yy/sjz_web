(function() {
  const baseSize = 96; 
  function setRem() {
    const scale = document.documentElement.clientWidth / 1920; // 
    console.log('basesieze', baseSize * Math.min(scale, 2))
    document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + "px";
  }
  setRem()
  window.onresize = function() {
    setRem();
  };
})();
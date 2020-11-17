window.onload = function() {
  const audioInput = document.getElementById('inputSrc')
  const btnValider = document.getElementById('btnValiderSrc')
  const MyaudioPlayer = document.getElementById('myAuidoPlayer')
  btnValider.addEventListener('click', (e) => {
    console.log('click', MyaudioPlayer.getAttribute('src'));
    MyaudioPlayer.setAttribute('src', audioInput.value)
  })
}
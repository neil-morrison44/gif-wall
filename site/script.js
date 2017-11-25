var count = 5 * 5;

function showGifs(gifList) {
  console.log(gifList);
  document.getElementById("gif-container").innerHTML = "";
  gifList.forEach(function(gif, index) {
    var html = "";
    const { url, title } = gif;
    if (url.endsWith(".gif")) {
      html = `<div class="gif-item" data-title="${title}">
        <img src="${url}"/>
      </div>`;
    } else {
      html = `<div class="gif-item" data-title="${title}">
          <video src="${url}" type="video/mp4" loop></video>
        </div>`;
    }
    if (index < count) {
      document.getElementById("gif-container").innerHTML += html;
    }
  });

  window.setInterval(function() {
    Array.from(document.getElementsByTagName("video")).forEach(video => {
      video.play();
    });
  }, 1e3);
}

document.onkeyup = function(evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key == "Escape" || evt.key == "Esc";
  } else {
    isEscape = evt.keyCode == 27;
  }
  if (isEscape) {
    document.getElementById(
      "gif-container"
    ).innerHTML = `<span class="exit"></span>`;
  }
};

function setSize(size) {
  count = size * size;
  document.body.style.setProperty("--item-height", `${100 / size}vh`);
  document.body.style.setProperty("--item-width", `${100 / size}vw`);
}

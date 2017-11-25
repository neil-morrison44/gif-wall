const Nightmare = require("nightmare");
const request = require("request");

const Size = 6;
const Count = Size * Size;
const silentMovieGifsURL = `http://www.reddit.com/r/silentmoviegifs.json?count=${Count +
  2}&limit=${Count + 2}`;

Nightmare.action(
  "fullScreen",
  (name, options, parent, win, renderer, done) => {
    parent.respondTo("fullScreen", done => {
      win.setFullScreen(true);
      done();
    });
    done();
  },
  function(done) {
    this.child.call("fullScreen", done);
  }
);

function loadPageWithGifs(gifs) {
  console.log(gifs);
  const nightmare = Nightmare({
    show: true,
    openDevTools: false,
    waitTimeout: 1e9
  });

  nightmare
    .goto(`file://${__dirname}/site/index.html`)
    .fullScreen()
    .evaluate(
      function(gifs, size) {
        setSize(size);
        showGifs(gifs);
      },
      gifs,
      Size
    )
    .wait(".exit")
    .end()
    .then(link => {
      process.exit();
    });
}

function transformRedditResponse(response) {
  var gifs = response.map(r => {
    return { title: r.data.title, url: r.data.url };
  });
  console.log(gifs);
  gifs = gifs.filter(gif => {
    if (gif.url.includes("https://imgur.com/a/")) {
      return false;
    } else {
      return true;
    }
  });
  return gifs.map(gif => {
    var newUrl = gif.url;
    if (gif.url.endsWith(".gif")) {
      newUrl = gif.url;
    } else if (gif.url.endsWith(".gifv")) {
      newUrl = gif.url.replace(".gifv", ".mp4");
    } else if (gif.url.includes("gfycat")) {
      newURl = gif.url.replace("gfycat", "giant.gfycat") + ".mp4";
    } else {
      newUrl = gif.url + ".mp4";
    }
    return { title: gif.title.replace(/\"/g, "'"), url: newUrl };
  });
}

request.get(
  {
    url: silentMovieGifsURL,
    json: true
  },
  (err, res, data) => {
    if (err) {
      console.log("Error:", err);
    } else if (res.statusCode !== 200) {
      console.log("Status:", res.statusCode);
    } else {
      loadPageWithGifs(transformRedditResponse(data.data.children));
    }
  }
);

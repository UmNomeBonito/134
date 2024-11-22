let video;
let detector;
let objetos = [];
let stats = false;
let som;

function preload() {
  som = loadSound('alarme.mp3'); // Substitua por um arquivo de som real
}

function setup() {
  canvas = createCanvas(380, 380);
  canvas.center();

  // Captura o vídeo e trata erros
  video = createCapture(VIDEO, function (stream) {
    console.log("Webcam ativada com sucesso!");
  }, function (err) {
    console.error("Erro ao acessar a webcam: ", err);
    alert("Por favor, permita o acesso à webcam no navegador.");
  });

  video.size(380, 380);
  video.hide();
}

function start() {
  detector = ml5.objectDetector('cocossd', modelLoaded);
  document.getElementById('idzinho').innerHTML = 'Detectando objetos...';
}

function modelLoaded() {
  console.log('Modelo carregado!');
  stats = true;
  detect();
}

function detect() {
  if (stats) {
    detector.detect(video, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      objetos = results;
      detect();
    });
  }
}

function draw() {
  image(video, 0, 0, 380, 380);

  if (stats && objetos.length > 0) {
    let bebeDetectado = false;
    for (let i = 0; i < objetos.length; i++) {
      let obj = objetos[i];
      let label = obj.label.toLowerCase();

      if (label === 'person') {
        bebeDetectado = true;
        fill(0, 255, 0);
        text(`${obj.label} ${floor(obj.confidence * 100)}%`, obj.x + 15, obj.y + 15);
        noFill();
        stroke(0, 255, 0);
        rect(obj.x, obj.y, obj.width, obj.height);
      }
    }

    if (bebeDetectado) {
      document.getElementById('idzinho').innerHTML = 'Bebê detectado!';
      document.getElementById('banana_um').innerHTML = `Quantidade de pessoas detectadas: ${objetos.length}`;
      if (som.isPlaying()) {
        som.stop();
      }
    } else {
      document.getElementById('idzinho').innerHTML = 'ALERTA: Nenhuma pessoa detectada!';
      if (!som.isPlaying()) {
        som.play();
      }
    }
  }
}

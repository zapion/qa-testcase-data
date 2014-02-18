var mediaRecorderList = [];
var lastErrorEvtFired = null;
var blobURLUI = null;

function mediaRecorderAttributeDump(mediaRecorder) {
  console.log(mediaRecorder.stream);
  console.log('Recording state: ' + mediaRecorder.state);
  console.log('Mime type: ' + mediaRecorder.mimeType);
}

function updateBlobURLUI(blob) {
  if(blobURLUI) {
    var blobURL = URL.createObjectURL(blob);
    var hrefElement = document.createElement('a');
    var breakLine = document.createElement('br');

    var video = document.createElement('video');
    video.width = 640;
    video.height = 480;
    _FReader = new FileReader();
    _FReader.readAsDataURL(blob);
    _FReader.onload = function (_FREvent) {
        video.src = _FREvent.target.result;
        video.play();
    };

    hrefElement.setAttribute('href', blobURL);
    hrefElement.textContent = 'Download Data Available';

    blobURLUI.appendChild(hrefElement);
    blobURLUI.appendChild(breakLine);
    blobURLUI.appendChild(video);
  }
}

function setupMediaRecorder(stream, numberOfRecorders, mimeType) {
  if(!numberOfRecorders) {
    numberOfRecorders = 1;
  }

  for(var i = 0; i < numberOfRecorders; i++){
    var mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.index = i;
    blobData[i] = [];

    mediaRecorder.ondataavailable = function(evt) {
      console.log('ondataavailable fired');
      console.log(evt);
      console.log(mediaRecorderAttributeDump(evt.target));
      blobData[evt.target.index].push(evt.data);
    };

    mediaRecorder.onstart = function(evt) {
      console.log('onstart fired');
      console.log(evt);
      console.log(mediaRecorderAttributeDump(evt.target));
      document.getElementsByTagName('label')[evt.target.index].innerHTML = evt.target.state;
    };

    mediaRecorder.onerror = function(evt) {
      console.log('onerror fired');
      console.log(evt);
      console.log(mediaRecorderAttributeDump(evt.target));
      errorMsg.innerHTML = evt;
      lastErrorEvtFired = evt;
    };

    mediaRecorder.onstop = function(evt) {
      console.log('onstop fired');
      console.log(evt);
      console.log(mediaRecorderAttributeDump(evt.target));
      document.getElementsByTagName('label')[evt.target.index].innerHTML = evt.target.state;
      updateBlobURLUI(new Blob(evt.target.blobData, { 'type' : mimeType }));
      evt.target.blobData = [];
    };

    mediaRecorder.onwarning = function(evt) {
      console.log('onwarning fired');
      console.log(evt);
      console.log(mediaRecorderAttributeDump(evt.target));
    };

    mediaRecorderList.push(mediaRecorder);

    console.log('Media Recorder created on index ' + (mediaRecorderList.length - 1));
    console.log(mediaRecorderAttributeDump(mediaRecorder));

    if(createMediaRecorderControls) {
      createMediaRecorderControls(mediaRecorderList.length - 1);
    }
  }
}

function createGUMStream(constraints, numberOfRecorders, mimeType) {
  navigator.mozGetUserMedia(constraints, function(stream) {
    setupMediaRecorder(stream, numberOfRecorders, mimeType);
  }, function(err) {
    console.log(err);
  });
}

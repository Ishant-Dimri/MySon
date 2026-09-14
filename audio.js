function start(){
    ensureCtx();
    if (started) return;
    started = true;
    
    // 1. Load your song
    const mySong = new Audio('bgm.mp3'); // Change this if your file name is different
    mySong.loop = true;
    
    // 2. Connect it to the existing audio system so the mute button still works
    const track = ctx.createMediaElementSource(mySong);
    track.connect(master);
    
    // 3. Play the song
    mySong.play();
  }

let audio = document.querySelector(".quranPlayer"),
  surahsContainer = document.querySelector(".surahs"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next"),
  prev = document.querySelector(".prev"),
  play = document.querySelector(".play");
getSurahs();
let isPlaying = true;
function togglePlay() {
  isPlaying ? false : true;
  if (isPlaying) {
    audio.pause();
    play.innerHTML = `<i class="fas fa-play"></i>`;
    isPlaying = false;
  } else {
    audio.play();
    play.innerHTML = `<i class="fas fa-pause"></i>`;
    isPlaying = true;
  }
}
function getSurahs() {
  //Fetch To Get Surahs data
  fetch("https://api.quran.sutanlab.id/surah")
    .then((response) => response.json())
    .then((data) => {
      for (let surah in data.data) {
        surahsContainer.innerHTML += `
                <div>
                    <p>${data.data[surah].name.long}</p>
                    <p>${data.data[surah].name.transliteration.en}</p>
                </div>
            `;
      }
      //selct all surahs
      let allSurahs = document.querySelectorAll(".surahs div"),
        AyahsAudios,
        AyahsText;
      allSurahs.forEach((surah, index) => {
        surah.addEventListener("click", () => {
          play.innerHTML = `<i class="fas fa-pause"></i>`;
          fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
            .then((response) => response.json())
            .then((data) => {
              let verses = data.data.verses;
              AyahsAudios = [];
              AyahsText = [];
              verses.forEach((verse) => {
                AyahsAudios.push(verse.audio.primary);
                AyahsText.push(verse.text.arab);
              });
              let AyahIndex = 0;
              changeAyah(AyahIndex);
              audio.addEventListener("ended", () => {
                AyahIndex++;
                if (AyahIndex < AyahsAudios.length) {
                  changeAyah(AyahIndex);
                } else {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "surah has been ended",
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  AyahIndex = 0;
                  if (allSurahs.length != index + 1) {
                    allSurahs[index + 1].click();
                  } else {
                    audio.pause();
                    play.innerHTML = `<i class="fas fa-play"></i>`;
                  }
                }
              });
              //Handle Next And Prev
              next.addEventListener("click", () => {
                AyahIndex < AyahsAudios.length - 1 ? AyahIndex++ : (AyahIndex = 0);
                changeAyah(AyahIndex);
                play.innerHTML = `<i class="fas fa-pause"></i>`;
              });
              prev.addEventListener("click", () => {
                AyahIndex == 0 ? (AyahIndex = AyahsAudios.length - 1) : AyahIndex--;
                changeAyah(AyahIndex);
                play.innerHTML = `<i class="fas fa-pause"></i>`;
              });
              //handle Play And Pause Audio

              play.addEventListener("click", togglePlay);
              function changeAyah(index) {
                audio.src = AyahsAudios[index];
                ayah.innerHTML = AyahsText[index];
              }
            });
        });
      });
    });
}

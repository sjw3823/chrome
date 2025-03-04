// contentScript.js
(function() {
    // 다크모드 토글을 위한 상태 저장
    let darkModeEnabled = false;
  
    // 다크모드 스타일 추가 (기존 페이지에 주입)
    const darkStyle = document.createElement('style');
    darkStyle.id = 'dark-mode-style';
    darkStyle.innerHTML = `
      body.dark-mode {
        background-color: black !important;
        color: white !important;
        transition: background-color 0.3s, color 0.3s;
      }
    `;
    document.head.appendChild(darkStyle);
  
    // 이미지 처리 함수 (위의 예제와 동일)
    function processImage(img) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
          data[i] = 0;
          data[i+1] = 0;
          data[i+2] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL();
    }
  
    function enableDarkImages() {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (!img.dataset.originalSrc) {
          img.dataset.originalSrc = img.src;
        }
        if (!img.complete) {
          img.onload = () => { img.src = processImage(img); };
        } else {
          img.src = processImage(img);
        }
      });
    }
  
    function disableDarkImages() {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc;
        }
      });
    }
  
    // 토글 버튼 생성 (페이지 상단에 고정)
    const toggleButton = document.createElement('button');
    toggleButton.innerText = '다크 모드 켜기';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = 10000;
    toggleButton.style.padding = '10px';
    toggleButton.style.cursor = 'pointer';
    document.body.appendChild(toggleButton);
  
    toggleButton.addEventListener('click', () => {
      darkModeEnabled = !darkModeEnabled;
      if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        enableDarkImages();
        toggleButton.innerText = '다크 모드 끄기';
      } else {
        document.body.classList.remove('dark-mode');
        disableDarkImages();
        toggleButton.innerText = '다크 모드 켜기';
      }
    });
  })();
  
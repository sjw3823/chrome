
function sayHello()
{ 
    document.body.innerText = "Hello, World!"; 
} 

const images = document.querySelectorAll('img');
images.forEach(img => {
    // 이미지가 로딩된 후 처리 (이미지가 미리 로드되지 않은 경우 이벤트를 이용할 수 있음)
    if (!img.complete) {
        img.onload = () => processImage(img);
    } else {
        processImage(img);
    }
});

function processImage(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        // 임계값을 통해 흰색 픽셀을 판별
        if (data[i] > 240 && data[i+1] > 240 && data[i+2] > 240) {
            data[i] = 0;     // R
            data[i+1] = 0;   // G
            data[i+2] = 0;   // B
        }
    }
    ctx.putImageData(imageData, 0, 0);
    img.src = canvas.toDataURL();
}


window.onload = sayHello;
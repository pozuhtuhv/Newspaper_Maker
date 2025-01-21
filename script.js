const memeContainer = document.getElementById("meme-container");
const generateButton = document.getElementById("generate");
const downloadButton = document.getElementById("download");

// 흑백 필터 함수
function applyGrayscale(ctx, x, y, width, height) {
  const imageData = ctx.getImageData(x, y, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;
    data[i + 1] = avg;
    data[i + 2] = avg;
  }

  ctx.putImageData(imageData, x, y);
}

generateButton.addEventListener("click", async () => {
  // 기존 내용 초기화
  memeContainer.innerHTML = "";

  // 캔버스 생성
  const canvas = document.createElement("canvas");
  canvas.width = 767; // 템플릿 크기에 맞춘 캔버스 크기
  canvas.height = 1012;
  const ctx = canvas.getContext("2d");

  // 템플릿 이미지 로드
  const template = new Image();
  template.src = "template.png"; // 템플릿 이미지 경로 확인 필요
  template.crossOrigin = "anonymous";

  template.onload = async () => {
    // 템플릿 이미지를 캔버스 크기에 맞게 그리기
    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

    // 이미지 1 처리
    const image1Input = document.getElementById("image1").files[0];
    if (image1Input) {
      const image1 = new Image();
      image1.src = URL.createObjectURL(image1Input);
      await new Promise((resolve) => {
        image1.onload = () => {
          const imgX = 246, imgY = 249, imgWidth = 495, imgHeight = 263;
          ctx.drawImage(image1, imgX, imgY, imgWidth, imgHeight);
          applyGrayscale(ctx, imgX, imgY, imgWidth, imgHeight); // 흑백 처리
          resolve();
        };
      });
    }

    // 이미지 2 처리
    const image2Input = document.getElementById("image2").files[0];
    if (image2Input) {
      const image2 = new Image();
      image2.src = URL.createObjectURL(image2Input);
      await new Promise((resolve) => {
        image2.onload = () => {
          const imgX = 246, imgY = 532, imgWidth = 260, imgHeight = 202;
          ctx.drawImage(image2, imgX, imgY, imgWidth, imgHeight);
          applyGrayscale(ctx, imgX, imgY, imgWidth, imgHeight); // 흑백 처리
          resolve();
        };
      });
    }

    // 텍스트 1 처리
    const text1 = document.getElementById("text1").value;
    if (text1) {
      ctx.font = "bold 45px JejuMyeongjo"; // JejuMyeongjo 폰트 사용
      ctx.fillStyle = "black";
      const textX = 244, textY = 185, lineHeight = 50;
      const lines = text1.split("\n"); // \n 기준으로 줄 나누기
      let yOffset = textY;

      // 각 줄을 그립니다.
      for (let i = 0; i < lines.length; i++) {
        if (i >= 2) break; // 최대 2줄까지만 표시
        ctx.fillText(lines[i], textX, yOffset);
        yOffset += lineHeight;
      }
    }

    // 텍스트 2 처리
    const text2 = document.getElementById("text2").value;
    if (text2) {
      ctx.font = "bold 40px JejuMyeongjo"; // JejuMyeongjo 폰트 사용
      ctx.fillStyle = "black";
      const textX = 514, textY = 565, lineHeight = 55;
      const lines = text2.split("\n"); // \n 기준으로 줄 나누기
      let yOffset = textY;

      // 각 줄을 그립니다.
      for (let i = 0; i < lines.length; i++) {
        if (i >= 4) break; // 최대 4줄까지만 표시
        ctx.fillText(lines[i], textX, yOffset);
        yOffset += lineHeight;
      }
    }

    // 결과 캔버스 추가
    memeContainer.appendChild(canvas);

    // 다운로드 버튼 활성화
    downloadButton.disabled = false;

    // 다운로드 기능
    downloadButton.onclick = () => {
      const link = document.createElement("a");
      link.download = "meme.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  };
});
export const imageParse = (images:any) => {
    try {
      if (typeof images === "string") {
        // Step 1: 이스케이프된 따옴표 제거 및 끝부분 백슬래시 제거
        images = images
        // eslint-disable-next-line
          .replace(/\\\"/g, '"') // 이스케이프된 따옴표 제거
          .replace(/\\$/, "") // 끝부분 백슬래시 제거
          .trim();
  
        // Step 2: 문자열이 JSON 배열처럼 보이는 경우 처리
        if (images.startsWith('"') && images.endsWith('"')) {
          images = images.slice(1, -1); // 양쪽의 큰따옴표 제거
        }
  
        // Step 3: 대괄호가 없을 경우 배열처럼 감싸기
        if (!images.startsWith("[") && !images.endsWith("]")) {
          images = `[${images}]`;
        }
      }
  
      // Step 4: JSON 파싱
      const parsed = JSON.parse(images || "[]");
  
      // Step 5: 중첩된 배열이 문자열 형태라면 한 번 더 파싱
      if (Array.isArray(parsed) && typeof parsed[0] === "string" && parsed[0].startsWith("[")) {
        return JSON.parse(parsed[0]);
      }
      return parsed[0]; // 최종 결과 반환
    } catch (error) {
      console.error("Error parsing images:", error);
      return []; // 파싱 실패 시 빈 배열 반환
    }
  };
  
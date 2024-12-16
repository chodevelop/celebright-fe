export const tryParseJson = (str: string) => {
  try {
    // JSON 파싱 시 예외가 발생하지 않도록
    return JSON.parse(
      str
        .replace(/\\"/g, '"') // 이스케이프된 큰따옴표 제거
        .replace(/\\\\/g, '') // 이스케이프된 백슬래시 제거
        .replace(/^"|"$/g, '') // 양 끝의 쌍따옴표 제거 (필요한 경우)
    );
  } catch (error) {
    console.error('JSON parsing error:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
};

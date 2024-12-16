export interface CustomJwtPayload {
  userId: string; // JWT의 'id' 필드
  email: string; // JWT의 'email' 필드 (필요에 따라 추가)
  exp: number; // 만료 시간 (JWT 표준 필드)
  influencerId?: string;
}

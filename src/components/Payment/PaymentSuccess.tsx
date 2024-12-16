import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import axios from "axios"; // axios 추가
import { savePaymentInfo } from "../../util/paymentApi";
import { getUserId } from "../../util/getUser";

const PaymentSuccess = (): JSX.Element => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const paymentKey = searchParams.get("paymentKey");
  const userId = searchParams.get("userId") || getUserId();
  const productId = searchParams.get("productId") || "";
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const orderName = searchParams.get("orderName") || "멤버쉽 상품";
  const paymentMethod = searchParams.get("paymentMethod")|| "토스페이먼츠";

  const confirmPayment = async (): Promise<void> => {
    
    if (!paymentKey || !orderId || !amount) {
      console.error("필수 파라미터가 누락되었습니다:", {
        paymentKey,
        orderId,
        amount,
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("결제 요청:", paymentKey, orderId, amount);

      const response = await fetch("http://localhost:4000/payments/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
        }),
      });

      console.log("응답 상태:", response.status);

      if (response.ok) {
        setIsConfirmed(true);
      } else {
        console.error("결제 승인 실패:", await response.text());
      }
    } catch (error) {
      console.error("결제 승인 중 오류 발생:", error);
    } finally {
      // 결제 정보 저장
      try {
        await savePaymentInfo({
          orderId,
          userId,
          productId,
          orderName,
          amount: Number(amount),
          paymentMethod,
          approvedAt: new Date().toISOString(),
        });
        console.log("결제 정보 저장 성공");
      } catch (error) {
        console.error("결제 정보 저장 실패:", error);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    confirmPayment(); // 페이지 로드 시 결제 승인 실행
  }, []);

  const PaymentDetails = () => {
    const details = [
      { label: "주문번호", value: orderId },
      { label: "상품명", value: orderName },
      { label: "결제 금액", value: `${amount}원` },
      { label: "결제 방법", value: paymentMethod },
      { label: "사용자 ID", value: userId },
      { label: "상품 ID", value: productId },
    ];

    return (
      <Box mt={2}>
        <Grid container spacing={2}>
          {details.map((detail) => (
            <Grid item xs={12} key={detail.label}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1" fontWeight="bold">
                  {detail.label}
                </Typography>
                <Typography variant="body1">{detail.value}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" py={4} px={2}>
      {isLoading ? (
        <Box textAlign="center" maxWidth="400px" width="100%">
          <CircularProgress />
          <Typography variant="h5" fontWeight="bold" mt={2}>
            결제를 처리 중입니다...
          </Typography>
        </Box>
      ) : isConfirmed ? (
        <Box textAlign="center" maxWidth="400px" width="100%">
          <img
            src="https://cdn-icons-png.flaticon.com/512/12632/12632500.png"
            width="120"
            height="120"
            alt="결제 완료"
          />
          <Typography variant="h5" fontWeight="bold" mt={2}>
            결제를 완료했어요
          </Typography>
          <PaymentDetails />
          <Box mt={4} display="flex" gap={2}>
            <Button
              variant="outlined"
              fullWidth
              href={`http://localhost:3000/mypage/${userId}/follows`}
            >
              돌아가기
            </Button>
          </Box>
        </Box>
      ) : (
        <Box textAlign="center" maxWidth="400px" width="100%">
          <Typography variant="h5" fontWeight="bold" mt={2} color="error">
            결제 승인에 실패했습니다.
          </Typography>
          <Typography variant="body1" mt={1} color="textSecondary">
            다시 시도하거나 관리자에게 문의하세요.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PaymentSuccess;

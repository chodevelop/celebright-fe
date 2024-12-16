import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";

const PaymentSuccess = (): JSX.Element => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  const confirmPayment = async (): Promise<void> => {
    if (!paymentKey || !orderId || !amount) {
      console.error("필수 파라미터가 누락되었습니다:", {
        paymentKey,
        orderId,
        amount,
      });
      return;
    }

    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  // 결제 상세 정보 컴포넌트
  const PaymentDetails = () => {
    const details = [
      { label: "결제 금액", value: `${amount}원` },
      { label: "주문번호", value: orderId },
      { label: "paymentKey", value: paymentKey },
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
      {isConfirmed ? (
        <Box textAlign="center" maxWidth="400px" width="100%">
          <img
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
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
              href="https://localhost:3000/payment"
            >
              다시 테스트하기
            </Button>
            <Button
              variant="contained"
              fullWidth
              href="https://docs.tosspayments.com/guides/v2/payment-widget/integration"
              target="_blank"
              rel="noopener noreferrer"
            >
              결제 연동 문서가기
            </Button>
          </Box>
        </Box>
      ) : (
        <Box textAlign="center" maxWidth="400px" width="100%">
          <img
            src="https://static.toss.im/lotties/loading-spot-apng.png"
            width="120"
            height="120"
            alt="결제 요청 중"
          />
          <Typography variant="h5" fontWeight="bold" mt={2}>
            결제 요청까지 성공했어요.
          </Typography>
          <Typography variant="body1" mt={1} color="textSecondary">
            결제 승인하고 완료해보세요.
          </Typography>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              onClick={confirmPayment}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? "승인 중..." : "결제 승인하기"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaymentSuccess;

import React, { useEffect, useState } from "react";
import { loadTossPayments, ANONYMOUS, TossPaymentsWidgets } from "@tosspayments/tosspayments-sdk";
import { Box, Button } from "@mui/material";
import { useLocation} from "react-router-dom";

// Amount 타입 정의
interface Amount {
    currency: string;
    value: number;
}

// 랜덤 문자열 생성 함수
const generateRandomString = (): string => Math.random().toString(36).substring(2, 15);

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const Payment = (): JSX.Element => {
    const location = useLocation();
    const { orderName, customerName, customerEmail, value, userId, productId } = location.state;
    console.log(location.state);

    const amount = { currency: "KRW", value };

    // 상태 정의
    const [ready, setReady] = useState<boolean>(false);
    const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null); // TossPayments의 타입 명시


    useEffect(() => {
        async function fetchPaymentWidgets() {
            const tossPayments = await loadTossPayments(clientKey);
            const widgetsInstance = tossPayments.widgets({ customerKey: ANONYMOUS });
            setWidgets(widgetsInstance);
        }

        fetchPaymentWidgets();
    }, []);

    useEffect(() => {
        async function renderPaymentWidgets() {
            if (!widgets) {
                return;
            }

            await widgets.setAmount(amount);

            await Promise.all([
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                }),
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }),
            ]);

            setReady(true);
        }

        renderPaymentWidgets();
    }, [widgets, amount]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            padding={3}
            overflow="auto"
            className="wrapper"
        >
            <Box maxWidth="md" width="100%" className="max-w-540">
                {/* 결제 방법 위젯 */}
                <Box id="payment-method" width="100%" className="w-100" />
                {/* 동의 위젯 */}
                <Box id="agreement" width="100%" className="w-100" marginY={2} />
                <Box paddingX={3} className="btn-wrapper" textAlign="center" width="100%">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={async () => {
                            if (!widgets) return; // null 체크

                            try {
                                await widgets.requestPayment({
                                    orderId: generateRandomString(),
                                    orderName,
                                    customerName,
                                    customerEmail,
                                    successUrl: `http://localhost:3000/payment/success?orderName=${encodeURIComponent(orderName)}&productId=${productId}&amount=${amount.value}&orderId=${generateRandomString()}&userId=${userId}&paymentMethod=${encodeURIComponent('TossPayments')}`,
                                    failUrl: `http://localhost:3000/payment/fail`,
                                });
                            } catch (error) {
                                console.error("결제 요청 실패:", error); // 에러 처리
                            }
                        }}
                        sx={{
                            padding: "11px 22px",
                            borderRadius: "8px",
                            fontWeight: "600",
                            fontSize: "17px",
                        }}
                    >
                        결제하기
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Payment;
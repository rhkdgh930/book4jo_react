const { createProxyMiddleware } = require("http-proxy-middleware");
const cookieParser = require("cookie-parser");

module.exports = function (app) {
  // 쿠키 파싱 미들웨어 추가
  app.use(cookieParser());

  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080", // 백엔드 서버 주소
      changeOrigin: true,
      onProxyReq: (proxyReq, req, res) => {
        // 클라이언트에서 보내는 쿠키를 백엔드로 전달
        const accessToken = req.cookies["accessToken"]; // req.cookies를 통해 accessToken 쿠키 값 가져오기

        if (accessToken) {
          proxyReq.setHeader("Authorization", `Bearer ${accessToken}`); // Authorization 헤더에 accessToken 추가
        }
      },
    })
  );
};

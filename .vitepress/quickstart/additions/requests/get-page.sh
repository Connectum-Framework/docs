curl --http2-prior-knowledge -sS \
  http://localhost:5000/page.v1.PageService/GetPage \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -H 'Connect-Protocol-Version: 1' \
  -d '{}'

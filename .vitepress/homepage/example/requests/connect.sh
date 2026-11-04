curl --http2-prior-knowledge -fsS \
  localhost:5000/greeter.v1.GreeterService/SayHello \
  -H 'Content-Type: application/json' -d '{"name":"Alice"}'

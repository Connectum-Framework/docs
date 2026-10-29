grpcurl -plaintext -import-path proto -proto greeter.proto \
  -d '{"name":"Alice"}' \
  localhost:5000 greeter.v1.GreeterService/SayHello

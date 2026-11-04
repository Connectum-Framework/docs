export const clients = [
    { id: 'curl', label: 'curl · Connect' },
    { id: 'grpcurl', label: 'grpcurl · gRPC' },
] as const;
export const credentials = [
    { id: 'successful', label: 'Valid JWT' },
    { id: 'missing', label: 'No JWT' },
    { id: 'invalid', label: 'Invalid JWT' },
] as const;
export type RequestClient = (typeof clients)[number]['id'];
export type RequestCredential = (typeof credentials)[number]['id'];

export function requestSources(curl: string, authority = 'localhost:5000') {
    const header = '  -H "Authorization: Bearer $TOKEN" \\\n';
    if (curl.split(header).length !== 2 || !curl.includes('http://localhost:5000/')) throw new Error('Review the curl request before deriving its credential variants.');
    const source = curl.trimEnd().replace('http://localhost:5000/', `http://${authority}/`);
    const grpcurl = `grpcurl -plaintext \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{}' \\
  ${authority} \\
  page.v1.PageService/GetPage`;
    const variants = (command: string) => ({
        successful: command,
        missing: command.replace(header, ''),
        invalid: command.replace('$TOKEN', 'invalid'),
    });
    return { curl: variants(source), grpcurl: variants(grpcurl) };
}

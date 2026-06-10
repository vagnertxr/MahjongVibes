import argparse
import socket
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path


class MahjongVibesHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".css": "text/css",
        ".html": "text/html; charset=utf-8",
        ".svg": "image/svg+xml",
        ".webmanifest": "application/manifest+json",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def local_addresses():
    addresses = {"127.0.0.1"}
    try:
        host_name = socket.gethostname()
        for info in socket.getaddrinfo(host_name, None, family=socket.AF_INET):
            addresses.add(info[4][0])
    except socket.gaierror:
        pass

    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as probe:
            probe.connect(("8.8.8.8", 80))
            addresses.add(probe.getsockname()[0])
    except OSError:
        pass

    return sorted(addresses, key=lambda ip: (ip.startswith("127."), ip))


def parse_args():
    parser = argparse.ArgumentParser(description="Serve Mahjong Vibes for local browser or phone testing.")
    parser.add_argument("--host", default="0.0.0.0", help="Host/IP to bind. Use 127.0.0.1 for this computer only.")
    parser.add_argument("--port", default=8000, type=int, help="Port to serve on.")
    return parser.parse_args()


def main():
    args = parse_args()
    root = Path(__file__).resolve().parent
    address = (args.host, args.port)
    server = ThreadingHTTPServer(address, lambda *args, **kwargs: MahjongVibesHandler(*args, directory=root, **kwargs))
    print("Mahjong Vibes debug server")
    print(f"Serving: {root}")
    for ip in local_addresses():
        if args.host not in ("0.0.0.0", ip) and not (args.host == "127.0.0.1" and ip.startswith("127.")):
            continue
        label = "this computer" if ip.startswith("127.") else "phone/Wi-Fi"
        print(f"Open on {label}: http://{ip}:{args.port}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    main()

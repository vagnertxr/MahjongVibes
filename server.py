from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path


class MahjongVibesHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".css": "text/css",
        ".html": "text/html; charset=utf-8",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    root = Path(__file__).resolve().parent
    address = ("127.0.0.1", 8000)
    server = ThreadingHTTPServer(address, lambda *args, **kwargs: MahjongVibesHandler(*args, directory=root, **kwargs))
    print(f"Mahjong Vibes debug server: http://{address[0]}:{address[1]}")
    print("Press Ctrl+C to stop.")
    server.serve_forever()


if __name__ == "__main__":
    main()

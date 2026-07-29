import gzip, io, os, functools
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = "/Users/macbookair/Desktop/eirion/out"
COMPRESS = (".html", ".css", ".js", ".json", ".svg", ".txt", ".xml")
IMMUTABLE = ("/_next/static/",)

class H(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)
    def end_headers(self):
        # mimic LiteSpeed on Hostinger: long cache on hashed assets
        if any(p in self.path for p in IMMUTABLE):
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        super().end_headers()
    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            path = os.path.join(path, "index.html")
        if not os.path.isfile(path):
            return super().send_head()
        accepts_gzip = "gzip" in self.headers.get("Accept-Encoding", "")
        if accepts_gzip and path.endswith(COMPRESS):
            with open(path, "rb") as f:
                body = gzip.compress(f.read(), 6)
            self.send_response(200)
            self.send_header("Content-Type", self.guess_type(path))
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            return io.BytesIO(body)
        return super().send_head()

ThreadingHTTPServer(("127.0.0.1", 4180), H).serve_forever()

import Foundation
import WebKit

/// Bundled www/ 를 app://localhost/… 로 제공 (Android WebViewAssetLoader 대응).
/// file:// + ES module/crossorigin 은 WKWebView에서 CORS로 실패해 검은 화면이 난다.
final class LocalWWWSchemeHandler: NSObject, WKURLSchemeHandler {
    static let scheme = "app"

    private let wwwRoot: URL
    private var tasks = [ObjectIdentifier: URLSessionDataTask]()

    init(wwwRoot: URL) {
        self.wwwRoot = wwwRoot
        super.init()
    }

    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let url = urlSchemeTask.request.url else {
            urlSchemeTask.didFailWithError(URLError(.badURL))
            return
        }

        var relative = url.path
        if relative.hasPrefix("/") {
            relative = String(relative.dropFirst())
        }
        if relative.isEmpty || relative.hasSuffix("/") {
            relative = (relative.isEmpty ? "" : relative) + "index.html"
        }

        let fileURL = wwwRoot.appendingPathComponent(relative)
        guard fileURL.standardizedFileURL.path.hasPrefix(wwwRoot.standardizedFileURL.path),
              FileManager.default.fileExists(atPath: fileURL.path),
              let data = try? Data(contentsOf: fileURL) else {
            CamaTabletLog.e("LocalWWW miss: \(relative)")
            let response = HTTPURLResponse(
                url: url,
                statusCode: 404,
                httpVersion: "HTTP/1.1",
                headerFields: ["Content-Type": "text/plain; charset=utf-8"]
            )!
            urlSchemeTask.didReceive(response)
            urlSchemeTask.didReceive(Data("Not Found".utf8))
            urlSchemeTask.didFinish()
            return
        }

        let mime = mimeType(for: fileURL.pathExtension)
        let response = HTTPURLResponse(
            url: url,
            statusCode: 200,
            httpVersion: "HTTP/1.1",
            headerFields: [
                "Content-Type": mime,
                "Content-Length": "\(data.count)",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-cache",
            ]
        )!
        CamaTabletLog.web("serve \(relative) (\(data.count) bytes, \(mime))")
        urlSchemeTask.didReceive(response)
        urlSchemeTask.didReceive(data)
        urlSchemeTask.didFinish()
    }

    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
        // no-op — sync handler
    }

    private func mimeType(for ext: String) -> String {
        switch ext.lowercased() {
        case "html", "htm": return "text/html; charset=utf-8"
        case "js", "mjs": return "text/javascript; charset=utf-8"
        case "css": return "text/css; charset=utf-8"
        case "json": return "application/json; charset=utf-8"
        case "png": return "image/png"
        case "jpg", "jpeg": return "image/jpeg"
        case "svg": return "image/svg+xml"
        case "woff": return "font/woff"
        case "woff2": return "font/woff2"
        case "ttf": return "font/ttf"
        case "map": return "application/json"
        default: return "application/octet-stream"
        }
    }
}

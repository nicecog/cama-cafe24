import Foundation
import WebKit

/// WebView로 네이티브 이벤트를 주입하는 헬퍼 (Android NativeEventEmitter 대응)
final class NativeEventEmitter {
    private weak var webView: WKWebView?

    init(webView: WKWebView) {
        self.webView = webView
    }

    func emit(type: String, ok: Bool = true, payload: Any? = nil, error: String? = nil) {
        var detail: [String: Any] = [
            "type": type,
            "ok": ok,
        ]
        if let payload {
            detail["payload"] = payload
        }
        if let error {
            detail["error"] = error
        }

        guard let data = try? JSONSerialization.data(withJSONObject: detail),
              let json = String(data: data, encoding: .utf8) else {
            CamaTabletLog.e("emit serialize failed type=\(type)")
            return
        }

        CamaTabletLog.bridge("emit type=\(type) ok=\(ok) jsonLen=\(json.count) error=\(error ?? "")")

        guard let escapedData = try? JSONSerialization.data(withJSONObject: [json]),
              let arrayString = String(data: escapedData, encoding: .utf8),
              arrayString.count >= 4 else {
            return
        }
        let jsonLiteral = String(arrayString.dropFirst().dropLast())

        let script = """
        (function(){try{var d=JSON.parse(\(jsonLiteral));\
        window.dispatchEvent(new CustomEvent('cama-tablet-native',{detail:d}));\
        return 'ok';}catch(e){console.error('cama-tablet-native emit failed',e);return 'err:'+e;}})();
        """

        DispatchQueue.main.async { [weak self] in
            self?.webView?.evaluateJavaScript(script) { result, err in
                if let err {
                    CamaTabletLog.bridge("emit \(type) evaluateJs error=\(err.localizedDescription)")
                } else {
                    CamaTabletLog.bridge("emit \(type) evaluateJs result=\(String(describing: result))")
                }
            }
        }
    }

    func emitQrStarted(qrPayload: String) {
        emit(type: "bleSessionStarted", ok: true, payload: ["qrPayload": qrPayload])
    }

    func emitHealthData(json: String) {
        CamaTabletLog.bridge("emitHealthData rawLen=\(json.count) preview=\(json.prefix(120))")
        guard let data = json.data(using: .utf8),
              let object = try? JSONSerialization.jsonObject(with: data) else {
            emitError("수신 데이터 파싱 실패")
            return
        }
        emit(type: "healthDataReceived", ok: true, payload: object)
    }

    func emitConnected(deviceName: String?) {
        emit(type: "bleConnected", ok: true, payload: ["deviceName": deviceName ?? "연결된 기기"])
    }

    func emitDisconnected() {
        emit(type: "bleDisconnected", ok: true)
    }

    func emitError(_ message: String) {
        CamaTabletLog.w("emitError: \(message)")
        emit(type: "bleError", ok: false, error: message)
    }
}

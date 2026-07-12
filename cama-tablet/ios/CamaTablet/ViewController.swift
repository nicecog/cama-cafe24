import UIKit
import WebKit
import CoreBluetooth

final class ViewController: UIViewController {
    private var webView: WKWebView!
    private var emitter: NativeEventEmitter!
    private var schemeHandler: LocalWWWSchemeHandler?
    private let bleManager = BleGattServerManager()
    private var lastHealthDataJson: String?
    private var bridgeReady = false
    private var statusLabel: UILabel?

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        bleManager.delegate = self
        setupWebView()
        loadBundledWebApp()
    }

    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        .landscape
    }

    override var prefersStatusBarHidden: Bool { true }

    private func setupWebView() {
        guard let wwwRoot = Bundle.main.resourceURL?.appendingPathComponent("www"),
              FileManager.default.fileExists(atPath: wwwRoot.appendingPathComponent("index.html").path) else {
            showFatal("웹 리소스(www/index.html)를 찾을 수 없습니다.")
            return
        }

        let handler = LocalWWWSchemeHandler(wwwRoot: wwwRoot)
        schemeHandler = handler

        let userContent = WKUserContentController()
        userContent.add(self, name: "camaTablet")
        userContent.addUserScript(WKUserScript(
            source: Self.bridgeBootstrapScript,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        ))

        let config = WKWebViewConfiguration()
        config.userContentController = userContent
        config.setURLSchemeHandler(handler, forURLScheme: LocalWWWSchemeHandler.scheme)
        if #available(iOS 14.0, *) {
            config.defaultWebpagePreferences.allowsContentJavaScript = true
        }
        config.preferences.javaScriptEnabled = true
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        let wv = WKWebView(frame: view.bounds, configuration: config)
        wv.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        wv.navigationDelegate = self
        wv.uiDelegate = self
        wv.scrollView.contentInsetAdjustmentBehavior = .never
        wv.isOpaque = true
        wv.backgroundColor = .white
        view.addSubview(wv)
        webView = wv
        emitter = NativeEventEmitter(webView: wv)
        refreshBridgeState()
    }

    private func loadBundledWebApp() {
        guard webView != nil else { return }
        // Android WebViewAssetLoader(https://appassets…) 와 동일하게 커스텀 스킴으로 로드
        guard let url = URL(string: "\(LocalWWWSchemeHandler.scheme)://localhost/index.html") else {
            showFatal("잘못된 로드 URL")
            return
        }
        CamaTabletLog.i("Loading \(url.absoluteString)")
        webView.load(URLRequest(url: url))
    }

    private func refreshBridgeState() {
        guard webView != nil else { return }

        var deviceInfo = TabletDeviceInfo.current().toDictionary()
        deviceInfo["v"] = BleConstants.qrVersion
        deviceInfo["app"] = BleConstants.qrAppId

        let caps: [String: Any] = [
            "offline": true,
            "blePeripheral": true,
            "qrGenerate": true,
            "bridgeVersion": 2,
            "deviceInfo": deviceInfo,
        ]

        guard let capsData = try? JSONSerialization.data(withJSONObject: caps),
              let capsJson = String(data: capsData, encoding: .utf8) else { return }

        let healthLiteral: String
        if let lastHealthDataJson,
           let escaped = try? JSONSerialization.data(withJSONObject: [lastHealthDataJson]),
           let array = String(data: escaped, encoding: .utf8) {
            healthLiteral = String(array.dropFirst().dropLast())
        } else {
            healthLiteral = "''"
        }

        let script = """
        window.__CAMA_CAPS__ = \(capsJson);
        window.__CAMA_LAST_HEALTH__ = \(healthLiteral);
        """
        webView.evaluateJavaScript(script, completionHandler: nil)
    }

    private func requestBlePermissionsAndStart() {
        switch CBPeripheralManager.authorization {
        case .denied, .restricted:
            emitter.emitError("블루투스 권한이 필요합니다. 설정에서 허용해 주세요.")
            return
        default:
            break
        }

        let started = bleManager.start()
        if !started {
            emitter.emitError("BLE 세션 시작 실패")
        }
    }

    private func stopBleSession() {
        bleManager.stop()
        emitter.emit(type: "bleSessionStopped", ok: true)
    }

    private func showFatal(_ message: String) {
        CamaTabletLog.e(message)
        let label = UILabel(frame: view.bounds.insetBy(dx: 24, dy: 24))
        label.text = message
        label.textColor = .darkText
        label.textAlignment = .center
        label.numberOfLines = 0
        label.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(label)
        statusLabel = label
    }

    private func showLoadError(_ message: String) {
        statusLabel?.removeFromSuperview()
        let label = UILabel()
        label.translatesAutoresizingMaskIntoConstraints = false
        label.text = "화면 로드 실패\n\(message)"
        label.textColor = .white
        label.backgroundColor = UIColor.black.withAlphaComponent(0.75)
        label.textAlignment = .center
        label.numberOfLines = 0
        view.addSubview(label)
        NSLayoutConstraint.activate([
            label.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            label.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            label.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            label.heightAnchor.constraint(greaterThanOrEqualToConstant: 80),
        ])
        statusLabel = label
    }

    /// Android JavascriptInterface 와 동일한 API를 window에 주입
    private static let bridgeBootstrapScript = """
    (function(){
      if (window.__CAMA_TABLET_BRIDGE__) return;
      window.__CAMA_TABLET_BRIDGE__ = true;
      window.__CAMA_CAPS__ = window.__CAMA_CAPS__ || '{}';
      window.__CAMA_LAST_HEALTH__ = window.__CAMA_LAST_HEALTH__ || '';
      function post(method){
        try {
          window.webkit.messageHandlers.camaTablet.postMessage({method: method});
        } catch (e) {
          console.error('camaTablet bridge post failed', method, e);
        }
      }
      var bridge = {
        generateQr: function(){ post('generateQr'); },
        stopBleSession: function(){ post('stopBleSession'); },
        clearLastHealthData: function(){ post('clearLastHealthData'); },
        getCapabilities: function(){
          var c = window.__CAMA_CAPS__;
          return (typeof c === 'string') ? c : JSON.stringify(c || {});
        },
        getBridgeVersion: function(){ return 2; },
        getLastHealthData: function(){ return window.__CAMA_LAST_HEALTH__ || ''; }
      };
      window.AndroidBridge = bridge;
      window.CamaTabletBridge = bridge;
    })();
    """
}

extension ViewController: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "camaTablet",
              let body = message.body as? [String: Any],
              let method = body["method"] as? String else { return }

        CamaTabletLog.bridge("fromWeb method=\(method)")
        switch method {
        case "generateQr":
            requestBlePermissionsAndStart()
        case "stopBleSession":
            stopBleSession()
        case "clearLastHealthData":
            lastHealthDataJson = nil
            refreshBridgeState()
            CamaTabletLog.i("lastHealthData cleared for new QR session")
        default:
            CamaTabletLog.w("Unknown bridge method: \(method)")
        }
    }
}

extension ViewController: WKNavigationDelegate, WKUIDelegate {
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        bridgeReady = true
        statusLabel?.removeFromSuperview()
        statusLabel = nil
        refreshBridgeState()
        emitter.emit(type: "bridgeReady", ok: true)
        if let lastHealthDataJson {
            emitter.emitHealthData(json: lastHealthDataJson)
        }
        CamaTabletLog.i("didFinish url=\(webView.url?.absoluteString ?? "")")
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        CamaTabletLog.e("navigation failed: \(error.localizedDescription)")
        showLoadError(error.localizedDescription)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        CamaTabletLog.e("provisional navigation failed: \(error.localizedDescription)")
        showLoadError(error.localizedDescription)
    }
}

extension ViewController: BleGattServerManagerDelegate {
    func bleSessionStarted(qrPayload: String) {
        CamaTabletLog.i("onSessionStarted qrLen=\(qrPayload.count)")
        emitter.emitQrStarted(qrPayload: qrPayload)
    }

    func bleDeviceConnected(deviceName: String?) {
        CamaTabletLog.i("onDeviceConnected name=\(deviceName ?? "")")
        emitter.emitConnected(deviceName: deviceName)
    }

    func bleDeviceDisconnected() {
        CamaTabletLog.i("onDeviceDisconnected")
        emitter.emitDisconnected()
    }

    func bleHealthDataReceived(json: String) {
        CamaTabletLog.i("onHealthDataReceived len=\(json.count)")
        lastHealthDataJson = json
        refreshBridgeState()
        emitter.emitHealthData(json: json)
    }

    func bleError(_ message: String) {
        CamaTabletLog.e("onError: \(message)")
        emitter.emitError(message)
    }
}

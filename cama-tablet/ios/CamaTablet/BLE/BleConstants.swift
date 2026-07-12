import Foundation
import CoreBluetooth

enum BleConstants {
    /// CAMA Tablet BLE 서비스 — QR payload에 포함되어 폰 앱이 스캔 후 연결
    static let serviceUUID = CBUUID(string: "F47AC10B-58CC-4372-A567-0E02B2C3D479")

    /// 폰 → 태블릿 건강 데이터 전송 (write)
    static let healthDataCharUUID = CBUUID(string: "6BA7B810-9DAD-11D1-80B4-00C04FD29E95")

    /// 태블릿 상태 알림 (notify)
    static let statusCharUUID = CBUUID(string: "6BA7B811-9DAD-11D1-80B4-00C04FD29E95")

    static let qrAppId = "cama-tablet"
    static let qrVersion = 1
}

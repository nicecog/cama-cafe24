import Foundation
import UIKit

struct TabletDeviceInfo {
    let deviceId: String
    let deviceName: String
    let serviceUuid: String
    let dataCharUuid: String

    func toQrPayloadJson() -> String {
        let payload: [String: Any] = [
            "v": BleConstants.qrVersion,
            "app": BleConstants.qrAppId,
            "deviceId": deviceId,
            "deviceName": deviceName,
            "serviceUuid": serviceUuid,
            "dataCharUuid": dataCharUuid,
        ]
        guard let data = try? JSONSerialization.data(withJSONObject: payload),
              let json = String(data: data, encoding: .utf8) else {
            return "{}"
        }
        return json
    }

    func toDictionary() -> [String: Any] {
        [
            "deviceId": deviceId,
            "deviceName": deviceName,
            "serviceUuid": serviceUuid,
            "dataCharUuid": dataCharUuid,
        ]
    }

    static func current() -> TabletDeviceInfo {
        let deviceId = UIDevice.current.identifierForVendor?.uuidString ?? "unknown"
        let suffix = String(deviceId.suffix(4)).uppercased()
        let name = UIDevice.current.name.trimmingCharacters(in: .whitespacesAndNewlines)
        let deviceName = name.isEmpty ? "CAMA-Tablet-\(suffix)" : name

        return TabletDeviceInfo(
            deviceId: deviceId,
            deviceName: deviceName,
            serviceUuid: BleConstants.serviceUUID.uuidString,
            dataCharUuid: BleConstants.healthDataCharUUID.uuidString
        )
    }
}

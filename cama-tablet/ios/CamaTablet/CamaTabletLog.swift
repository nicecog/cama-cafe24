import Foundation
import UIKit
import os.log

enum CamaTabletLog {
    private static let logger = Logger(subsystem: "com.cama.tablet.offline", category: "CamaTablet")

    static func i(_ message: String) {
        logger.info("\(message, privacy: .public)")
    }

    static func w(_ message: String) {
        logger.warning("\(message, privacy: .public)")
    }

    static func e(_ message: String) {
        logger.error("\(message, privacy: .public)")
    }

    static func ble(_ message: String) {
        logger.info("[BLE] \(message, privacy: .public)")
    }

    static func bridge(_ message: String) {
        logger.info("[Bridge] \(message, privacy: .public)")
    }

    static func web(_ message: String) {
        logger.info("[Web] \(message, privacy: .public)")
    }
}

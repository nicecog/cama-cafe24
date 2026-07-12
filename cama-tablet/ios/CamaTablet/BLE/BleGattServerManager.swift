import Foundation
import CoreBluetooth

protocol BleGattServerManagerDelegate: AnyObject {
    func bleSessionStarted(qrPayload: String)
    func bleDeviceConnected(deviceName: String?)
    func bleDeviceDisconnected()
    func bleHealthDataReceived(json: String)
    func bleError(_ message: String)
}

/// 태블릿 BLE Peripheral — GATT 서버 + 광고.
/// 폰 앱이 QR의 serviceUuid로 연결 후 HEALTH_DATA characteristic에 JSON write.
final class BleGattServerManager: NSObject {
    weak var delegate: BleGattServerManagerDelegate?

    private var peripheralManager: CBPeripheralManager?
    private var healthDataCharacteristic: CBMutableCharacteristic?
    private var statusCharacteristic: CBMutableCharacteristic?
    private var isRunning = false
    private var writeBuffer = Data()
    private var subscribedCentrals: [CBCentral] = []

    func start() -> Bool {
        // 홈→재진입 등 isRunning=true 상태에서도 QR 이벤트를 다시내야 함.
        // (early return 시 웹이 "블루투스 준비 중"에 멈춤)
        writeBuffer.removeAll(keepingCapacity: false)
        subscribedCentrals.removeAll()

        if peripheralManager == nil {
            peripheralManager = CBPeripheralManager(delegate: self, queue: .main)
        } else if isRunning, let manager = peripheralManager {
            manager.stopAdvertising()
            manager.removeAllServices()
        }

        isRunning = true
        CamaTabletLog.ble("start requested state=\(peripheralManager?.state.rawValue ?? -1)")

        if peripheralManager?.state == .poweredOn {
            setupServiceAndAdvertise()
        }

        let qrPayload = TabletDeviceInfo.current().toQrPayloadJson()
        delegate?.bleSessionStarted(qrPayload: qrPayload)
        return true
    }

    func stop() {
        isRunning = false
        writeBuffer.removeAll(keepingCapacity: false)
        subscribedCentrals.removeAll()

        if let manager = peripheralManager {
            manager.stopAdvertising()
            manager.removeAllServices()
        }
    }

    var isActive: Bool { isRunning }

    private func setupServiceAndAdvertise() {
        guard let manager = peripheralManager, manager.state == .poweredOn else {
            delegate?.bleError("블루투스가 꺼져 있습니다. 설정에서 켜 주세요.")
            return
        }

        manager.removeAllServices()

        let healthChar = CBMutableCharacteristic(
            type: BleConstants.healthDataCharUUID,
            properties: [.write, .writeWithoutResponse],
            value: nil,
            permissions: [.writeable]
        )
        healthDataCharacteristic = healthChar

        let statusChar = CBMutableCharacteristic(
            type: BleConstants.statusCharUUID,
            properties: [.read, .notify],
            value: nil,
            permissions: [.readable]
        )
        statusCharacteristic = statusChar

        let service = CBMutableService(type: BleConstants.serviceUUID, primary: true)
        service.characteristics = [healthChar, statusChar]
        manager.add(service)
    }

    private func startAdvertising() {
        guard let manager = peripheralManager, isRunning else { return }

        // 기기명 + 128bit UUID는 광고 패킷 한도 초과 가능 → service UUID만 광고
        manager.startAdvertising([
            CBAdvertisementDataServiceUUIDsKey: [BleConstants.serviceUUID],
        ])
        CamaTabletLog.ble("advertising started")
    }

    private func tryCompleteWrite() -> Bool {
        guard !writeBuffer.isEmpty else { return false }
        guard let accumulated = String(data: writeBuffer, encoding: .utf8)?
            .trimmingCharacters(in: .whitespacesAndNewlines),
              !accumulated.isEmpty else {
            return false
        }

        guard let data = accumulated.data(using: .utf8),
              (try? JSONSerialization.jsonObject(with: data)) != nil else {
            CamaTabletLog.ble("JSON incomplete bytes=\(writeBuffer.count)")
            return false
        }

        CamaTabletLog.ble("JSON complete bytes=\(writeBuffer.count) chars=\(accumulated.count)")
        delegate?.bleHealthDataReceived(json: accumulated)
        writeBuffer.removeAll(keepingCapacity: false)
        notifyStatus("data_received")
        return true
    }

    private func notifyStatus(_ status: String) {
        guard let statusCharacteristic,
              let data = status.data(using: .utf8),
              !subscribedCentrals.isEmpty,
              let manager = peripheralManager else { return }

        manager.updateValue(data, for: statusCharacteristic, onSubscribedCentrals: subscribedCentrals)
    }
}

extension BleGattServerManager: CBPeripheralManagerDelegate {
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        CamaTabletLog.ble("peripheral state=\(peripheral.state.rawValue)")

        switch peripheral.state {
        case .poweredOn:
            if isRunning {
                setupServiceAndAdvertise()
            }
        case .poweredOff:
            if isRunning {
                delegate?.bleError("블루투스가 꺼져 있습니다. 설정에서 켜 주세요.")
            }
        case .unauthorized:
            delegate?.bleError("블루투스 권한이 필요합니다.")
        case .unsupported:
            delegate?.bleError("이 기기는 블루투스를 지원하지 않습니다.")
        default:
            break
        }
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, didAdd service: CBService, error: Error?) {
        if let error {
            CamaTabletLog.e("addService failed: \(error.localizedDescription)")
            delegate?.bleError("GATT 서비스를 등록할 수 없습니다.")
            return
        }
        CamaTabletLog.ble("service added, starting advertise")
        startAdvertising()
    }

    func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
        if let error {
            CamaTabletLog.e("advertising failed: \(error.localizedDescription)")
            delegate?.bleError("BLE 광고 시작 실패 (\(error.localizedDescription))")
            return
        }
        CamaTabletLog.ble("advertising confirmed")
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, central: CBCentral, didSubscribeTo characteristic: CBCharacteristic) {
        if characteristic.uuid == BleConstants.statusCharUUID {
            if !subscribedCentrals.contains(where: { $0.identifier == central.identifier }) {
                subscribedCentrals.append(central)
            }
        }
        CamaTabletLog.ble("central subscribed \(central.identifier)")
        delegate?.bleDeviceConnected(deviceName: "연결된 기기")
        notifyStatus("connected")
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, central: CBCentral, didUnsubscribeFrom characteristic: CBCharacteristic) {
        subscribedCentrals.removeAll { $0.identifier == central.identifier }
        CamaTabletLog.ble("central unsubscribed \(central.identifier)")

        if writeBuffer.count > 0 {
            CamaTabletLog.w("[BLE] disconnected with pending bytes=\(writeBuffer.count)")
            if !tryCompleteWrite() {
                delegate?.bleError("데이터 수신 불완전 (\(writeBuffer.count) bytes). QR 화면 유지 후 다시 전송해 주세요.")
            }
        }
        writeBuffer.removeAll(keepingCapacity: false)
        delegate?.bleDeviceDisconnected()
        notifyStatus("waiting")
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveWrite requests: [CBATTRequest]) {
        for request in requests {
            guard request.characteristic.uuid == BleConstants.healthDataCharUUID else {
                peripheral.respond(to: request, withResult: .requestNotSupported)
                continue
            }

            if let value = request.value {
                CamaTabletLog.ble("onWrite len=\(value.count) bufferBefore=\(writeBuffer.count)")
                writeBuffer.append(value)
                CamaTabletLog.ble("bufferAfter=\(writeBuffer.count)")
                _ = tryCompleteWrite()
            }

            peripheral.respond(to: request, withResult: .success)
        }
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, didReceiveRead request: CBATTRequest) {
        if request.characteristic.uuid == BleConstants.statusCharUUID {
            request.value = "waiting".data(using: .utf8)
            peripheral.respond(to: request, withResult: .success)
        } else {
            peripheral.respond(to: request, withResult: .requestNotSupported)
        }
    }
}

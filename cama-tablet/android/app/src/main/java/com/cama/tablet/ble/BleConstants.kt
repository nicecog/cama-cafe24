package com.cama.tablet.ble

import java.util.UUID

object BleConstants {
    /** CAMA Tablet BLE 서비스 — QR payload에 포함되어 폰 앱이 스캔 후 연결 */
    val SERVICE_UUID: UUID = UUID.fromString("F47AC10B-58CC-4372-A567-0E02B2C3D479")

    /** 폰 → 태블릿 건강 데이터 전송 (write) */
    val HEALTH_DATA_CHAR_UUID: UUID = UUID.fromString("6BA7B810-9DAD-11D1-80B4-00C04FD29E95")

    /** 태블릿 상태 알림 (notify) */
    val STATUS_CHAR_UUID: UUID = UUID.fromString("6BA7B811-9DAD-11D1-80B4-00C04FD29E95")

    const val QR_APP_ID = "cama-tablet"
    const val QR_VERSION = 1
}

package com.camaplus.app.healthconnect

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

/** Health Connect 권한 설명 화면 (Play 정책용) */
class PermissionsRationaleActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val textView = TextView(this)
        textView.setPadding(48, 48, 48, 48)
        textView.textSize = 16f
        textView.text =
            "CAMA Plus는 Health Connect에 저장된 심박수 데이터를 읽어 " +
                "의료진 상담 및 건강 관리를 위해 서버에 안전하게 저장합니다."
        setContentView(textView)
    }
}
